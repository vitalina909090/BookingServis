using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BookingServis.Api.Entities;

public class AppUser : IdentityUser<Guid>
{
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
