"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  Vendor,
  IVendorService,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorsResponse,
} from "@/services/vendor.service";
import type { PaginationInfo } from "@/lib/pagination";
import { useEnhancedCrudViewModel } from "@/hooks/use-enhanced-crud-view-model";

export function useVendorsViewModel(vendorService: IVendorService) {
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemsCount: 0,
    pageSize: 10,
    currentPage: 1,
    pagesCount: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState(searchTerm);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchTerm), 350);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const list = useCallback(async () => {
    const res: VendorsResponse = await vendorService.getVendors({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: debounced,
    });
    setPagination(res.pagination);
    return res.data;
  }, [vendorService, pagination.currentPage, pagination.pageSize, debounced]);

  const service = useMemo(
    () => ({
      list,
      create: (data: CreateVendorRequest) => vendorService.createVendor(data),
      update: (id: string, data: UpdateVendorRequest) =>
        vendorService.updateVendor(id, data),
      delete: (id: string) => vendorService.deleteVendor(id),
    }),
    [vendorService, list]
  );

  const crud = useEnhancedCrudViewModel<
    Vendor,
    CreateVendorRequest,
    UpdateVendorRequest
  >(service, {
    itemTypeName: "Vendor",
    itemTypeNamePlural: "Vendors",
    getItemDisplayName: (vendor: Vendor) => vendor.vendorName,
  });

  const searchVendors = (term: string) => {
    setPagination((p) => ({ ...p, currentPage: 1 }));
    setSearchTerm(term);
  };

  const changePage = (page: number) =>
    setPagination((p) => ({ ...p, currentPage: page }));
  const changePageSize = (size: number) =>
    setPagination((p) => ({ ...p, pageSize: size, currentPage: 1 }));

  return {
    ...crud,
    pagination,
    searchTerm,
    searchVendors,
    changePage,
    changePageSize,
  };
}
