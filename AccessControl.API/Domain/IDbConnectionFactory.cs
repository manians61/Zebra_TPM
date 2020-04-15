using System.Data;

namespace AccessControl.API.Domain
{
    public interface IDbConnectionFactory
    {
         IDbConnection CreateDbConnection(DbConnectionName connectionName);
    }
}