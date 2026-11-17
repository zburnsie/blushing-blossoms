using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlushingBlossoms.API.Migrations
{
    /// <inheritdoc />
    public partial class AddItemCountsAndInstallationDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BoutonnieresCount",
                table: "Inquiries",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BridesmaidBouquetsCount",
                table: "Inquiries",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CenterpiecesCount",
                table: "Inquiries",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CorsagesCount",
                table: "Inquiries",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstallationDetails",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BoutonnieresCount",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "BridesmaidBouquetsCount",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "CenterpiecesCount",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "CorsagesCount",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "InstallationDetails",
                table: "Inquiries");
        }
    }
}
