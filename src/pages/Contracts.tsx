
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useContracts } from '@/hooks/use-contracts';
import { ContractRecord } from '@/types/contract-types';
import TabulatorTable from '@/components/contracts/TabulatorTable';
import { ColumnDefinition, RowComponent } from '@/types/tabulator-types';
import { toast } from 'sonner';

const Contracts = () => {
  const navigate = useNavigate();
  const { 
    contracts, 
    isLoadingContracts, 
    contractsError, 
    refetchContracts 
  } = useContracts();
  
  const [contractsData, setContractsData] = useState<ContractRecord[]>([]);

  useEffect(() => {
    if (contracts) {
      setContractsData(contracts);
    }
  }, [contracts]);

  const columns: ColumnDefinition[] = useMemo(() => [
    { title: "Contract Name", field: "contract_name", sorter: "string", headerFilter: true },
    { title: "Client", field: "client_name", sorter: "string", headerFilter: true },
    { title: "Start Date", field: "start_date", sorter: "date", headerFilter: true },
    { title: "End Date", field: "end_date", sorter: "date", headerFilter: true },
    { title: "Status", field: "status", sorter: "string", headerFilter: true },
    { title: "Value", field: "contract_value", sorter: "number", formatter: "money" }
  ], []);

  // Explicitly type the event and row for TypeScript
  const handleRowClick = (_e: Event, row: RowComponent) => {
    navigate(`/contracts/${row.getData().id}`);
  };

  if (isLoadingContracts) {
    return <div>Loading contracts...</div>;
  }

  if (contractsError) {
    return <div>Error: {contractsError.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Contracts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <Button asChild>
          <Link to="/contracts/new">
            <Plus className="mr-2 h-4 w-4" /> New Contract
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Contract Management</CardTitle>
          <CardDescription>
            Manage contracts, clients, and related information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contractsData && contractsData.length > 0 ? (
            <TabulatorTable 
              columns={columns}
              data={contractsData}
              onRowClick={handleRowClick}
            />
          ) : (
            <div>No contracts found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contracts;
