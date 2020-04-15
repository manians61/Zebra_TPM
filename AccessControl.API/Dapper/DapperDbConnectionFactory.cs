using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using AccessControl.API.Domain;

namespace AccessControl.API.Dapper
{
    public class DapperDbConnectionFactory : IDbConnectionFactory
    {
        private readonly IDictionary<DbConnectionName, string> _connectionDict;

        public DapperDbConnectionFactory(IDictionary<DbConnectionName, string> connectionDict)
        {
            _connectionDict = connectionDict;
        }
        //Inject SqlConnection with different Connection Str
        public IDbConnection CreateDbConnection(DbConnectionName connectionName)
        {
            string st_ConnectionString = null;
            if(_connectionDict.TryGetValue(connectionName, out st_ConnectionString))
            {
                return new SqlConnection(st_ConnectionString);
            }
            throw new ArgumentNullException();
        }
    }
}