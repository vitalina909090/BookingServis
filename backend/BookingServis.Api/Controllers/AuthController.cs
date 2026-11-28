using System.Security.Claims;
using BookingServis.Api.Auth;
using BookingServis.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookingServis.Api.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    ITokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            return RegistrationFailed(createResult);

        var roleResult = await userManager.AddToRoleAsync(user, Roles.Traveler);
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            return Problem(statusCode: StatusCodes.Status500InternalServerError);
        }

        return StatusCode(StatusCodes.Status201Created, await BuildResponseAsync(user));
    }

    [HttpPost("login")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return InvalidCredentials();

        var check = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (check.IsLockedOut)
            return Problem(
                title: "Забагато невдалих спроб. Спробуйте пізніше",
                statusCode: StatusCodes.Status429TooManyRequests);
        if (!check.Succeeded)
            return InvalidCredentials();

        return Ok(await BuildResponseAsync(user));
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserDto>> Me()
    {
        var id = User.FindFirstValue("sub");
        var user = id is null ? null : await userManager.FindByIdAsync(id);
        if (user is null)
            return Unauthorized();

        return Ok(await ToDtoAsync(user));
    }

    private ObjectResult InvalidCredentials() =>
        Problem(title: "Невірний email або пароль", statusCode: StatusCodes.Status401Unauthorized);

    private ActionResult RegistrationFailed(IdentityResult result)
    {
        var codes = result.Errors.Select(e => e.Code).ToHashSet();

        if (codes.Contains(nameof(IdentityErrorDescriber.DuplicateEmail)) ||
            codes.Contains(nameof(IdentityErrorDescriber.DuplicateUserName)))
        {
            return Problem(
                title: "Користувач з таким email вже існує",
                statusCode: StatusCodes.Status409Conflict);
        }

        return Problem(
            title: "Не вдалося зареєструватися",
            statusCode: StatusCodes.Status400BadRequest);
    }

    private async Task<UserDto> ToDtoAsync(AppUser user)
    {
        var roles = await userManager.GetRolesAsync(user);
        return new UserDto(user.Id, user.Email!, user.FirstName, user.LastName, user.PhoneNumber, roles.ToList());
    }

    private async Task<AuthResponse> BuildResponseAsync(AppUser user)
    {
        var dto = await ToDtoAsync(user);
        var (token, expires) = tokenService.CreateToken(user, dto.Roles);
        return new AuthResponse(token, expires, dto);
    }
}