"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteAddress, setDefaultAddress } from "@/lib/actions/address.actions";
import { IAddress } from "@/types";
import AddressForm from "./address-form";

export default function AddressesClient({
  addresses,
}: {
  addresses: IAddress[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | undefined>();

  const handleAddNew = () => {
    setEditingAddress(undefined);
    setFormOpen(true);
  };

  const handleEdit = (address: IAddress) => {
    setEditingAddress(address);
    setFormOpen(true);
  };

  const handleSetDefault = async (id: string) => {
    const res = await setDefaultAddress(id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast(res.message);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t saved any addresses yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address._id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{address.fullName}</h3>
                  {address.isDefault && <Badge>Default</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.street} <br />
                  {address.city}, {address.province}, {address.postalCode}
                  <br />
                  {address.country} <br />
                  {address.phone}
                </p>
                <div className="flex gap-2 flex-wrap pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(address._id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <DeleteDialog
                    id={address._id}
                    action={deleteAddress}
                    callbackAction={() => router.refresh()}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button variant="outline" onClick={handleAddNew}>
        <PlusIcon className="w-4 h-4 mr-2" /> Add New Address
      </Button>

      <AddressForm
        open={formOpen}
        onOpenChange={setFormOpen}
        address={editingAddress}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
