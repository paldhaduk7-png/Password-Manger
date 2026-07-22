import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

export default function Disply({users}){


const [visibleIndex, setVisibleIndex] = useState(null);

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
            <div className="flex items-center gap-2">
    <span>
  {visibleIndex === index ? item.password : "********"}
</span>
{visibleIndex === index ? (
  <Eye
    onClick={() => setVisibleIndex(null)}
    className="size-5 cursor-pointer"
  />
) : (
  <EyeOff
    onClick={() => setVisibleIndex(index)}
    className="size-5 cursor-pointer"
  />
)}
  </div>
        </td>

        <td className="px-4 py-3">
          <DropdownMenu>
  <DropdownMenuTrigger>
  <MoreVertical className="h-5 w-5 cursor-pointer" />
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