"use client";

import { useState } from "react";

import { UserData } from "@/lib/type";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "@/components/EditProfileDialog";

type EditProfileButtonProps = {
  user: UserData;
};

const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};

export default EditProfileButton;
