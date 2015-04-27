# GameChat
GameChat is an ASP.NET 5 application to allow admins to communicate with players in several games such as Minecraft or Terraria in a web page.

## Configuration

`config.json` provides a sample configuration in JSON format.
Configurations will also be read from environment variables.

Below are details information about each field.

| Key | Type | Description |
|:----|:-----|:------------|
| `Data:Type` | string | <ul><li>`InMemory` or empty: `InMemoryStorageLogic` is used to store chat messages. All chat messages will be cleared when the application restart.</li><li>`AzureStorage`: `AzureTableStorageLogic` is used to store chat messages.</li></ul>
| `Data:AzureStorage:ConnectionString` | string | (required only if `Data:Type` is `AzureStorage`) Connection string to the Azure Storage account
| `Data:AzureStorage:TableName` | string | (optional) Name of the Azure Table to store chat messages. Default value is `ChatMessages`.
| `Chat:Password` | string | A common password for all servers. A value of `null` indicates no common password are required (users still has to log in to each individual server if necessary).
| `Chat:Servers:{serverName}:Name` | string | Display name of the server.
| `Chat:Servers:{serverName}:Type` | string | Type of the server. Currently GameChat supports only `tshock` for Terraria. `forge`, `bukkit` or `sponge` for Minecraft may be added in the future.
| `Chat:Servers:{serverName}:Host` | string | Address of the host (IP or domain with port)
| `Chat:Servers:{serverName}:Username` <br /> `Chat:Servers:{serverName}:Password` | string | (optional) Providing these values allows users to skip authenticating to that server.

\* `{serverName}` is the unique identifier of your server in GameChat. It will be used as the dictionary key in `InMemoryStorageLogic` or the primary key in `AzureTableStorageLogic`.

## Deployment

You can clone the repo and use Visual Studio 2015 to publish
If you want to deploy this directly to your Azure subscription, just click the button below.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)
