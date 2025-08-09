"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"
import { useEnhancedCrudViewModel } from "@/hooks/use-enhanced-crud-view-model"
import { Trash2, Edit, Plus } from "lucide-react"

// Example data structure
interface ExampleItem {
  id: string
  name: string
  description: string
}

// Mock service for demonstration
const mockService = {
  list: async (): Promise<ExampleItem[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      { id: "1", name: "Contract A", description: "Important business contract" },
      { id: "2", name: "Contract B", description: "Service agreement" },
      { id: "3", name: "Contract C", description: "Partnership agreement" },
    ]
  },
  create: async (data: Omit<ExampleItem, "id">): Promise<ExampleItem> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { ...data, id: Date.now().toString() }
  },
  update: async (id: string, data: Partial<ExampleItem>): Promise<ExampleItem> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { id, name: data.name || "", description: data.description || "" }
  },
  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    // Simulate potential error (uncomment to test error handling)
    // if (Math.random() > 0.7) throw new Error("Network error occurred")
  },
}

export function EnhancedDeleteExample() {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog()
  const { success, error, warning, info } = useEnhancedToast()
  
  // Using the enhanced CRUD view model with confirmation dialogs and toasts
  const viewModel = useEnhancedCrudViewModel(mockService, {
    itemTypeName: "Contract",
    itemTypeNamePlural: "Contracts",
    getItemDisplayName: (item: ExampleItem) => item.name,
  })

  const {
    items,
    loading,
    selectedItems,
    deleteItem,
    deleteSelectedItems,
    toggleItemSelection,
    toggleAllItems,
    ConfirmationDialog: CrudConfirmationDialog,
  } = viewModel

  // Example of manual confirmation dialog usage
  const handleManualDelete = (item: ExampleItem) => {
    showConfirmation({
      variant: "destructive",
      title: "Delete Contract",
      description: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isLoading: false,
      onConfirm: async () => {
        try {
          await mockService.delete(item.id)
          success({
            title: "Success!",
            description: `${item.name} has been deleted successfully.`,
          })
        } catch (err) {
          error({
            title: "Delete Failed",
            description: `Failed to delete ${item.name}. Please try again.`,
          })
        }
      },
    })
  }

  // Example toast notifications
  const showExampleToasts = () => {
    success({
      title: "Operation Successful",
      description: "Your action was completed successfully.",
    })

    setTimeout(() => {
      warning({
        title: "Warning",
        description: "Please review your settings before proceeding.",
      })
    }, 1500)

    setTimeout(() => {
      info({
        title: "Information",
        description: "Here's some helpful information for you.",
      })
    }, 3000)

    setTimeout(() => {
      error({
        title: "Error Occurred",
        description: "Something went wrong. Please try again.",
      })
    }, 4500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Delete & Toast System Demo</CardTitle>
          <CardDescription>
            This example demonstrates the professional confirmation dialogs and customizable toast notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={showExampleToasts} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Show Example Toasts
            </Button>
            
            {selectedItems.length > 0 && (
              <Button 
                onClick={deleteSelectedItems} 
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedItems.length})
              </Button>
            )}
            
            <Button 
              onClick={toggleAllItems}
              variant="secondary"
            >
              {selectedItems.length === items.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {/* Enhanced delete with automatic confirmation dialog and toast */}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    {/* Manual confirmation dialog example */}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleManualDelete(item)}
                    >
                      Manual Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No items found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Enhanced Delete with Automatic Confirmation:</h4>
            <p className="text-sm text-muted-foreground">
              Use the red delete button to see the automatic confirmation dialog with professional styling and toast notifications.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">2. Manual Confirmation Dialog:</h4>
            <p className="text-sm text-muted-foreground">
              Use the "Manual Delete" button to see how to implement custom confirmation dialogs.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">3. Toast Notifications:</h4>
            <p className="text-sm text-muted-foreground">
              Click "Show Example Toasts" to see different toast styles. Configure designs in Settings → Components → Toast Notifications.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">4. Bulk Operations:</h4>
            <p className="text-sm text-muted-foreground">
              Select multiple items and use "Delete Selected" to see bulk delete confirmation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Render confirmation dialogs */}
      <ConfirmationDialog />
      <CrudConfirmationDialog />
    </div>
  )
}
