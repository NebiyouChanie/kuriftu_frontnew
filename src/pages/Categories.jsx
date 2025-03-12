import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/categories`, { name: newCategory });
      toast.success("Category added successfully");
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (name) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${BASE_URL}/categories`, { data: { name } });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting category");
    }
  };

  return (
    <div className="p-6 max-w-[600px]">
      <h2 className="text-xl font-semibold mb-4">Manage Menu Categories</h2>
      <div className="flex gap-2 mb-8">
        <Input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={addCategory} disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </Button>
      </div>
      <ul className="list-disc pl-6">
        {categories?.map((category) => (
          <li key={category?._id} className="flex justify-between items-center p-2 border rounded-md mb-3">
            <span>{category?.name}</span>
            <Button variant="destructive" onClick={() => deleteCategory(category.name)}>
              <Trash size={16} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManagement;
