

export default function Disply({users}){
    return(
        <>
        <table className="w-full overflow-hidden rounded-xl border border-purple-200">
  <thead className="bg-gradient-to-r from-violet-600 to-purple-500 text-white">
    <tr>
      <th className="px-4 py-3 text-left">Website</th>
      <th className="px-4 py-3 text-left">Username</th>
      <th className="px-4 py-3 text-left">Password</th>
    </tr>
  </thead>

  <tbody>
    {users.map((item, index) => (
      <tr
        key={index}
        className="border-b border-purple-100 hover:bg-purple-50"
      >
        <td className="px-4 py-3">
          {item.url}
        </td>

        <td className="px-4 py-3">
          {item.userName}
        </td>

        <td className="px-4 py-3">
          {item.password}
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </>
    )
}