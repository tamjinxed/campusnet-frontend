"use client";

import { Image, Video, ListChecks, CalendarDays, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/app/components/ui/avatar";
import { Card, CardContent } from "@/app/components/ui/card";
import FeedPost from "@/app/components/dashboard/FeedPost";
import RightSidebar from "@/app/components/dashboard/RightSidebar";
import { useEffect, useState } from "react";
import { CreatePostModal } from "@/app/components/modals/CreatePostModal";
import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";

// For Auth
import { useAuth } from "../context/AuthContext";
import ProtectedRoutes from "@/app/components/ProtectedRoutes";
import api from "@/app/lib/axios";
import { Button } from "@/app/components/ui/button";

function DashboardPage() {
    const router = useRouter();

    let { user, logout } = useAuth();

    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    const [posts, setPosts] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (posts.length === 0) {
            const getPosts = async () => {
                setIsLoading(true);
                setError(null);

                try {
                    const { data } = await api.get("/communities/my");
                    const response = await api.get(`/posts`);
                    setPosts(response.data.data.posts);
                } catch (error) {
                    console.log(error);
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            };

            getPosts();
        }
    }, [posts.length]);

    return (
        <div className="min-h-screen bg-gray-50">
            <TopHeader />
            <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">
                {/* Left Sidebar - Hidden on mobile */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                {/* Main Feed - Full width on mobile */}
                <main className="flex-1 w-full md:w-auto space-y-6">
                    {/* Create Post Card */}
                    <Card className="rounded-lg shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src="/placeholder-user.jpg" />
                                    <AvatarFallback className="bg-gray-200">{`${user.firstName[0]}${user.lastName[0]}`}</AvatarFallback>
                                </Avatar>
                                <Input
                                    placeholder="What's on your mind..."
                                    className="flex-1 bg-gray-50 border-0 cursor-pointer"
                                    onClick={() => setIsCreatePostOpen(true)}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                <div className="flex space-x-4">
                                    <button
                                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                        onClick={() =>
                                            setIsCreatePostOpen(true)
                                        }
                                    >
                                        <Image className="w-5 h-5" />
                                        <span className="hidden sm:inline text-sm">
                                            Photo
                                        </span>
                                    </button>
                                    <button
                                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                        onClick={() =>
                                            setIsCreatePostOpen(true)
                                        }
                                    >
                                        <CalendarDays className="w-5 h-5" />
                                        <span className="hidden sm:inline text-sm">
                                            Event
                                        </span>
                                    </button>
                                    <button
                                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                        onClick={() =>
                                            setIsCreatePostOpen(true)
                                        }
                                    >
                                        <ListChecks className="w-5 h-5" />
                                        <span className="hidden sm:inline text-sm">
                                            Poll
                                        </span>
                                    </button>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="text-purple-600 hover:text-purple-800 font-medium"
                                    onClick={() => setIsCreatePostOpen(true)}
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    <span className="hidden sm:inline">
                                        Create Post
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feed Posts */}
                    {!isLoading && !error && (
                        <>
                            {posts.length > 0 &&
                                posts.map((post) => (
                                    <FeedPost key={post.id} post={post} />
                                ))}
                        </>
                    )}
                </main>

                {/* Right Sidebar - Hidden on mobile */}
                <div className="hidden lg:block">
                    <RightSidebar />
                </div>
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                open={isCreatePostOpen}
                onOpenChange={setIsCreatePostOpen}
            />
        </div>
    );
}

export default function Dashboard() {
    return (
        <ProtectedRoutes>
            <DashboardPage />
        </ProtectedRoutes>
    );
}
