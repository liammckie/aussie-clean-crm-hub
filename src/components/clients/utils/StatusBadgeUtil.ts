
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500 hover:bg-emerald-600";
    case "Prospect":
      return "bg-blue-500 hover:bg-blue-600";
    case "On Hold":
      return "bg-amber-500 hover:bg-amber-600";
    case "Cancelled":
      return "bg-slate-500 hover:bg-slate-600";
    default:
      return "bg-slate-500 hover:bg-slate-600";
  }
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};
