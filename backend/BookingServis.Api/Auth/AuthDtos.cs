using System.ComponentModel.DataAnnotations;

namespace BookingServis.Api.Auth;

public record RegisterRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(8)] string Password,
    [property: Required, MaxLength(200)] string FullName,
    string? PhoneNumber);

public record LoginRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Password);

public record UserDto(
    Guid Id,
    string Email,
    string FullName,
    string? PhoneNumber,
    IReadOnlyList<string> Roles);

public record AuthResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    UserDto User);
