"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { BellIcon } from "lucide-react";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export const Inbox = () => {
  return (
    <ClientSideSuspense
      fallback={
        <>
          <Button variant={"ghost"} disabled className="relative" size="icon">
            <BellIcon className="size-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
        </>
      }
    >
      <InboxMenu />
    </ClientSideSuspense>
  );
};

export const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="relative" size="icon">
            <BellIcon className="size-4" />
            {inboxNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-sky-500 text-xs text-white flex items-center justify-center">
                {inboxNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          {inboxNotifications.length > 0 ? (
            <InboxNotificationList>
              {inboxNotifications.map((inboxNotifications) => (
                <InboxNotification
                  key={inboxNotifications.id}
                  inboxNotification={inboxNotifications}
                />
              ))}
            </InboxNotificationList>
          ) : (
            <div className="p-2 w-[400px] text-center text-muted-foreground ">
              No notification
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};
