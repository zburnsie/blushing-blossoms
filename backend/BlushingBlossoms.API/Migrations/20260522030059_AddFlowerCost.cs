using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlushingBlossoms.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFlowerCost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "FlowerCost",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlowerCost",
                table: "Inquiries");
        }
    }
}
