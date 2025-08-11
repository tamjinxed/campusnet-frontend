// app/groups/page.tsx
'use client';

import {useEffect, useState} from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { CreateGroupModal } from "@/app/components/modals/CreateGroupModal";
import { TopHeader } from '@/app/components/layout/topheader';
import { LeftSidebar } from '@/app/components/dashboard/LeftSidebar';
import {useAuth} from "@/app/context/AuthContext";
import api from "@/app/lib/axios";
import {Avatar, AvatarFallback, AvatarImage} from "@/app/components/ui/avatar";
import {uuidToNumericString} from "@/app/utils/utils";

export default function GroupsPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("your-groups");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  const [userGroups, setUserGroups] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    const { data : {data} } = await api.get("/groups/my");
    setUserGroups(data.groups);

    const { data : {data: suggestedGroups} } = await api.get("/groups/suggested?page=1&limit=3");
    setSuggestedGroups(suggestedGroups.groups);
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <TopHeader />

      <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <LeftSidebar />
        </div>

        {/* Main Content - Full width on mobile */}
        <main className="flex-1 w-full md:w-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex space-x-1 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("your-groups")}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
                  activeTab === "your-groups" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Your Groups
              </button>
              <button
                onClick={() => setActiveTab("requested-groups")}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
                  activeTab === "requested-groups" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Requested Groups
              </button>
            </div>

            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              onClick={() => setIsCreateGroupModalOpen(true)}
            >
              Create Group
            </Button>
          </div>

          {/* Your Groups Content */}
          {activeTab === "your-groups" && (
            <div className="space-y-4">

                  {userGroups?.map((group, index) => (
                      <Link
                          key={index}
                          href={`/groups/${encodeURIComponent(uuidToNumericString(group.id))}`}
                          className="block"
                      >
                        <Card className="hover:ring-2 hover:ring-purple-600 transition">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                              <div className="w-full sm:w-24 h-24">
                                <Avatar className="w-20 h-20">
                                  <AvatarImage src={group.logo} />
                                  <AvatarFallback className="bg-purple-100 text-purple-600">{group.name[0]}{group.name[1]}</AvatarFallback>
                                </Avatar>
                                {/*<Image*/}
                                {/*    src={group.logo}*/}
                                {/*    alt={group.name}*/}
                                {/*    width={96}*/}
                                {/*    height={96}*/}
                                {/*    className="w-full h-full rounded-lg object-cover"*/}
                                {/*/>*/}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">{group.name}</h3>
                                    <p className="text-sm text-gray-600">{group["memberCount"]} {group["memberCount"] === 1 ? "Member" : "Members"}</p>
                                  </div>
                                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                                    View Posts
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {group.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                  ))}
            </div>
          )}

          {/* Groups You May be Interested In */}
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Groups You May be Interested In</h2>
            <div className="space-y-4">
              {suggestedGroups?.map((group, index) => (
                <Link
                  key={index}
                  href={`/groups/${encodeURIComponent(uuidToNumericString(group.id))}`}
                  className="block"
                >
                  <Card className="hover:ring-2 hover:ring-purple-600 transition">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="w-full sm:w-24 h-24">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={group.logo} />
                            <AvatarFallback className="bg-purple-100 text-purple-600">{group.name[0]}{group.name[1]}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{group.name}</h3>
                              <p className="text-sm text-gray-600">{group["memberCount"]} {group["memberCount"] === 1 ? "Member" : "Members"}</p>
                            </div>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                              Join
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {group.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        open={isCreateGroupModalOpen}
        onOpenChange={setIsCreateGroupModalOpen}
      />
    </div>
  );
}
