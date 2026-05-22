using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlushingBlossoms.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFlowerCostItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FlowerCostItems",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlowerCostItems",
                table: "Inquiries");
        }
    }
}
