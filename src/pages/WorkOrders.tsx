
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { WorkOrderFilters } from '@/components/work-orders/WorkOrderFilters';
import { WorkOrderList } from '@/components/work-orders/WorkOrderList';
import { WorkOrderEmptyState } from '@/components/work-orders/WorkOrderEmptyState';
import { WorkOrderSearchBar } from '@/components/work-orders/WorkOrderSearchBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { dummyWorkOrders } from '@/data/mockWorkOrders';

// Work Orders main component
const WorkOrders = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: '',
    priority: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // For infinite scrolling
  const [visibleOrders, setVisibleOrders] = useState<Array<any>>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = isMobile ? 3 : 5;
  
  // Filter work orders based on search and filters
  const filteredWorkOrders = dummyWorkOrders.filter(workOrder => {
    const searchMatch =
      workOrder.work_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.site.toLowerCase().includes(searchQuery.toLowerCase());
    
    const statusMatch = activeFilters.status === '' || workOrder.status === activeFilters.status;
    
    const priorityMatch = activeFilters.priority === '' || workOrder.priority === activeFilters.priority;
    
    let dateMatch = true;
    if (activeFilters.dateFrom) {
      const fromDate = new Date(activeFilters.dateFrom);
      const workOrderDate = new Date(workOrder.scheduled_start);
      dateMatch = dateMatch && workOrderDate >= fromDate;
    }
    if (activeFilters.dateTo) {
      const toDate = new Date(activeFilters.dateTo);
      const workOrderDate = new Date(workOrder.scheduled_start);
      dateMatch = dateMatch && workOrderDate <= toDate;
    }
    
    return searchMatch && statusMatch && priorityMatch && dateMatch;
  });
  
  // Load more items for infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = page * ITEMS_PER_PAGE;
      const newItems = filteredWorkOrders.slice(startIndex, endIndex);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setVisibleOrders(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
      
      setLoading(false);
    }, 500);
  }, [page, loading, hasMore, filteredWorkOrders, ITEMS_PER_PAGE]);
  
  // Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 1.0 }
    );
    
    const currentRef = loaderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreItems]);
  
  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setVisibleOrders([]);
    setHasMore(true);
    
    // Load initial items
    const initialItems = filteredWorkOrders.slice(0, ITEMS_PER_PAGE);
    setVisibleOrders(initialItems);
    setPage(prev => prev + 1);
  }, [searchQuery, activeFilters, filteredWorkOrders.length, ITEMS_PER_PAGE]);

  const handleViewDetails = (workOrderId: string) => {
    console.log(`View details for work order ${workOrderId}`);
    navigate(`/work-orders/${workOrderId}`);
  };

  const handleCreateWorkOrder = () => {
    navigate('/work-orders/new');
  };

  const handleRefresh = () => {
    setPage(1);
    setVisibleOrders([]);
    setHasMore(true);
    
    // Reload initial items
    const initialItems = filteredWorkOrders.slice(0, ITEMS_PER_PAGE);
    setVisibleOrders(initialItems);
    setPage(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Work Orders"
        description="View and manage all service requests and tasks."
        breadcrumbs={[{ label: "Work Orders" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar - toggle on smaller screens */}
        {showFilters && (
          <div className="lg:hidden">
            <WorkOrderFilters
              onApplyFilters={setActiveFilters}
              initialFilters={activeFilters}
              onCancel={() => setShowFilters(false)}
            />
          </div>
        )}
        
        {/* Filters sidebar - always visible on larger screens */}
        <div className="hidden lg:block">
          <WorkOrderFilters
            onApplyFilters={setActiveFilters}
            initialFilters={activeFilters}
            onCancel={() => {}}
          />
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3">
          <WorkOrderSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            onRefresh={handleRefresh}
          />

          {filteredWorkOrders.length === 0 ? (
            <WorkOrderEmptyState 
              onCreateWorkOrder={handleCreateWorkOrder}
              searchApplied={searchQuery !== '' || activeFilters.status !== '' || activeFilters.priority !== ''}
            />
          ) : (
            <WorkOrderList
              workOrders={visibleOrders}
              onViewDetails={handleViewDetails}
              loaderRef={loaderRef}
              loading={loading}
              hasMore={hasMore}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrders;
