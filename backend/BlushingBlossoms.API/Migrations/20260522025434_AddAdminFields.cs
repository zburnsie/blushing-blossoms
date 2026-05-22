using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlushingBlossoms.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BookingAmount",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowStages",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookingAmount",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "WorkflowStages",
                table: "Inquiries");
        }
    }
}
