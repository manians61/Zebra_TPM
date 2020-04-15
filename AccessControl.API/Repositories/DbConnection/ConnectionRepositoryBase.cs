using System.Data;
using AccessControl.API.Domain;

namespace AccessControl.API.Repositories.DbConnection
{
    public abstract class ConnectionRepositoryBase
    {
        public IDbConnection DbConnection { get; private set; }
        public ConnectionRepositoryBase(IDbConnectionFactory dbConnectionFactory, int connectionType)
        {
            //set connection string
            switch (connectionType)
            {
                case 0:
                    this.DbConnection = dbConnectionFactory.CreateDbConnection(DbConnectionName.PrdUltronConnection);
                    break;
                case 1:
                    this.DbConnection = dbConnectionFactory.CreateDbConnection(DbConnectionName.QasConnection);
                    break;
                case 2:
                    this.DbConnection = dbConnectionFactory.CreateDbConnection(DbConnectionName.MysConnection);
                    break;
                case 3:
                    this.DbConnection = dbConnectionFactory.CreateDbConnection(DbConnectionName.DomainConnection);
                    break;
            }

        }
    }
}