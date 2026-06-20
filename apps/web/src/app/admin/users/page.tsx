import { Search, ShieldAlert, UserCheck, MoreVertical } from 'lucide-react';

export default function UsersManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Users Management</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage platform accounts, roles, and access.</p>
        </div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-500" />
        </div>
        <input type="text" className="w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-emerald-500" placeholder="Search by name or email..." />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <UserRow name="Super Admin" email="admin@platform.com" role="ADMIN" date="Jan 10, 2026" status="Active" />
            <UserRow name="Albin User" email="albin@example.com" role="USER" date="Jun 15, 2026" status="Active" />
            <UserRow name="Suspicious Bot" email="bot123@spam.com" role="USER" date="Yesterday" status="Suspended" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({ name, email, role, date, status }: any) {
  return (
    <tr className="hover:bg-zinc-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-medium text-sm">
            {name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-zinc-200">{name}</p>
            <p className="text-xs text-zinc-500">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
          {role === 'ADMIN' ? <ShieldAlert size={12} className="mr-1" /> : <UserCheck size={12} className="mr-1" />}
          {role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-zinc-400">{date}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-xs font-medium ${status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>{status}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button className="text-zinc-500 hover:text-emerald-400 p-2"><MoreVertical size={18} /></button>
      </td>
    </tr>
  );
}
