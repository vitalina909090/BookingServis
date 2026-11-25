using BookingServis.Api.Auth;
using BookingServis.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookingServis.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    ITokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(error.Code, error.Description);
            return ValidationProblem(ModelState);
        }

        await userManager.AddToRoleAsync(user, Roles.Traveler);

        return StatusCode(201, await BuildResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Problem(title: "Невірний email або пароль", statusCode: 401);

        var check = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!check.Succeeded)
            return Problem(title: "Невірний email або пароль", statusCode: 401);

        return Ok(await BuildResponse(user));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me()
    {
        var id = User.FindFirst("sub")?.Value;
        var user = await userManager.FindByIdAsync(id!);
        if (user is null)
            return Unauthorized();

        return Ok(await ToDto(user));
    }

    private async Task<UserDto> ToDto(AppUser user)
    {
        var roles = await userManager.GetRolesAsync(user);
        return new UserDto(user.Id, user.Email!, user.FullName, user.PhoneNumber, roles.ToList());
    }

    private async Task<AuthResponse> BuildResponse(AppUser user)
    {
        var dto = await ToDto(user);
        var (token, expires) = tokenService.CreateToken(user, dto.Roles);
        return new AuthResponse(token, expires, dto);
    }
}