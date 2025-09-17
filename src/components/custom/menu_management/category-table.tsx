import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, FolderX } from "lucide-react"

interface Category {
    id: string
    name: string
    maxMenus: number
}

interface CategoryTableProps {
    categories: Category[]
    onEdit: (category: Category) => void
    onDelete: (id: string) => void
    onAddNew?: () => void
}

export function CategoryTable({
    categories,
    onEdit,
    onDelete,
    onAddNew
}: CategoryTableProps) {
    const isEmpty = categories.length === 0

    return (
        <Table>
            {!isEmpty && (
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Max Menus</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
            )}
            <TableBody>
                {isEmpty ? (
                    <TableRow>
                        <TableCell colSpan={3} className="h-96 text-center">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <FolderX className="h-36 w-36 text-muted-foreground" />
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-muted-foreground">
                                        No categories found
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Get started by creating a new category
                                    </p>
                                </div>
                                {onAddNew && (
                                    <Button
                                        onClick={onAddNew}
                                        className="mt-4"
                                    >
                                        Add New Category
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>{category.maxMenus}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(category)}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onDelete(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}