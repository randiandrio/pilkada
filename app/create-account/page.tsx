import { PrismaClient } from "@prisma/client";
import Add from "./action/Add";

const prisma = new PrismaClient();

const appData = async () => {
  const res = await prisma.appData.findMany({
    include: {
      admin: true,
    },
  });
  return res;
};

const User = async () => {
  const usr = await appData();

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Data Aplikasi</h4>
            </div>

            <div className="table-responsive">
              <table className="table primary-table-bordered">
                <thead className="thead-success">
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Nama Aplikasi</th>
                    <th scope="col">Nama Admin</th>
                    <th scope="col">HP</th>
                    <th scope="col">WA</th>
                  </tr>
                </thead>
                <tbody>
                  {usr.map((x: any, index) => (
                    <tr className="hover" key={x.id}>
                      <td align="center" width={100}>
                        {index + 1}
                      </td>
                      <td>{x.nama}</td>
                      <td>
                        <ul>
                          {x.admin.map((a: any) => (
                            <li key={x.id}>- {a.nama}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <ul>
                          {x.admin.map((a: any) => (
                            <li key={x.id}>- {a.hp}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <ul>
                          {x.admin.map((a: any) => (
                            <li key={x.id}>- {a.wa}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Add />
        </div>
      </div>
    </div>
  );
};

export default User;
