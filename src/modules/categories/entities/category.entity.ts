export interface CategoryResponse {
  id: string;
  name: string;
  icon: string;
  parentId: string | null;
  sortOrder: number;
  children?: CategoryResponse[];
}
