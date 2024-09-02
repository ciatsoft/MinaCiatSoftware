using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper : BaseDbWrapper
    {
        protected override string SQLConnectionString { get; }
        protected override TimeSpan SQLCommandTimeOut { get; }

        public DbWrapper()
        {
            SQLConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["cCon"].ToString();
            SQLCommandTimeOut = TimeSpan.FromSeconds(15);
        }
        public T MappingProperties<T>(object item)
        {
            if (item != DBNull.Value)
                return (T)item;
            else
                return default(T);
        }

        private T FillEntity<T>(IDataReader reader) where T : class, new()
        {
            T e = new T();
            for (int j = 0; j < reader.FieldCount; j++)
            {
                foreach (var item in e.GetType().GetProperties())
                {
                    if (reader.GetName(j).ToUpper().Equals(item.Name.ToUpper()))
                    {
                        if (!item.PropertyType.IsEnum)
                            item.SetValue(e, (reader[j] is DBNull ? null : reader[j]));
                        else if (!(reader[j] is DBNull))
                        {
                            var valor = reader[j].ToString();
                            if (char.IsDigit(valor.First()) && reader[j].GetType() == typeof(string))
                                valor = string.Concat("Item", valor);

                            item.SetValue(e, Enum.Parse(item.PropertyType, valor));
                        }
                    }

                }
            }
            return e;
        }

        public List<SqlParameter> GenerateSQLParameters<T>(T o)
        {
            var listParameters = new List<SqlParameter>();
            var parametersName = o.GetType().GetProperties();

            foreach (var p in parametersName)
            {
                if (p.GetValue(o)?.GetType().GetProperty("Id") == null)
                    listParameters.Add(new SqlParameter($"@{p.Name}", p.GetValue(o))
                    {
                        IsNullable = true
                    });
                else
                    listParameters.Add(new SqlParameter($"@{p.Name}", p.GetValue(o).GetType().GetProperty("Id").GetValue(p.GetValue(o)))
                    {
                        IsNullable = true
                    });
            }

            return listParameters;
        }
    }
}