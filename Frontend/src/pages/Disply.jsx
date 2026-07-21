import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function Disply({users}){
    return(
        <>
        <table className="w-full overflow-hidden rounded-xl border border-purple-200">
  <thead className="bg-gradient-to-r from-violet-600 to-purple-500 text-white">
    <tr>
      <th className="px-4 py-3 text-left">Website</th>
      <th className="px-4 py-3 text-left">Username</th>
      <th className="px-4 py-3 text-left">Password</th>
      <th className="px-4 py-3 text-left">Action</th>
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

        <td className="px-4 py-3">
          <DropdownMenu>
  <DropdownMenuTrigger>
      <Button variant="ghost" size="icon" type="button">
    <MoreVertical className="h-5 w-5 cursor-pointer" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuItem>
      <Pencil className="mr-2 h-4 w-4" />
      Update
    </DropdownMenuItem>

    <DropdownMenuItem className="text-red-500">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </>
    )
}