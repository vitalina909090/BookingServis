using System.ComponentModel.DataAnnotations;

namespace BookingServis.Api.Auth;

public record RegisterRequest(
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required, MaxLength(128)] string Password,
    [Required, MinLength(2), MaxLength(100)] string FirstName,
    [Required, MinLength(2), MaxLength(100)] string LastName,
    [MaxLength(32)] string? PhoneNumber);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    IReadOnlyList<string> Roles);

public record AuthResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    UserDto User);
