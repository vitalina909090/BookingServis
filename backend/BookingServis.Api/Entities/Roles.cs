namespace BookingServis.Api.Entities;

public static class Roles
{
    public const string Traveler = "Traveler";
    public const string Owner = "Owner";
    public const string Admin = "Admin";

    public static readonly string[] All = [Traveler, Owner, Admin];
}
