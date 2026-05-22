using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlushingBlossoms.API.Migrations
{
    /// <inheritdoc />
    public partial class AddKanbanAndPricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KanbanStage",
                table: "Inquiries",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PricingData",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KanbanStage",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "PricingData",
                table: "Inquiries");
        }
    }
}
