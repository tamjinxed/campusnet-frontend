"use client";

import { useState, useEffect, useRef } from "react";
import {
    X,
    Image as ImageIcon,
    BarChart2,
    Loader2,
    XCircle,
    Video,
    Calendar,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/app/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/axios";
import { supabaseAdmin } from "@/app/lib/supabase";

interface CreatePostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenEvent?: () => void;
}

interface PostLocation {
    id: string;
    name: string;
    type: "community" | "group";
}

type Mode = "default" | "poll";

interface FileWithPreview extends File {
    preview?: string;
}

export const CreatePostModal = ({
    open,
    onOpenChange,
}: CreatePostModalProps) => {
    const { user } = useAuth();

    // State for the form inputs
    const [postContent, setPostContent] = useState("");
    const [postLocationId, setPostLocationId] = useState<string | undefined>(
        undefined,
    );
    const [postVisibility, setPostVisibility] = useState<string>("private");

    // State for the dropdown options
    const [locations, setLocations] = useState<PostLocation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileInputError, setFileInputError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [mode, setMode] = useState<Mode>("default");
    const [images, setImages] = useState<FileWithPreview[]>([]);
    const [videos, setVideos] = useState<FileWithPreview[]>([]);
    const [pollOptions, setPollOptions] = useState<string[]>([""]);

    // State for selected image files
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Ref for the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Only fetch data if the modal is open and we haven't already fetched it
        if (open && locations.length === 0) {
            const fetchPostLocations = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // Fetch both communities and groups in parallel
                    const [communitiesResponse, groupsResponse] =
                        await Promise.all([
                            api.get("/communities/my"),
                            api.get("/groups/my"),
                        ]);

                    const community = communitiesResponse.data.data.communities;

                    // Format the data into a unified structure
                    const userCommunity = {
                        id: community.id,
                        name: community.name,
                        type: "community" as const,
                    };

                    const userGroups = groupsResponse.data.data.groups.map(
                        (group: any) => ({
                            id: group.id,
                            name: group.name,
                            type: "group" as const,
                        }),
                    );

                    // Combine them into one list
                    setLocations([userCommunity, ...userGroups]);

                    // Set a default selected value
                    if (userCommunity) {
                        setPostLocationId(userCommunity.id);
                    }
                } catch (err) {
                    console.error(
                        "Failed to fetch communities or groups:",
                        err,
                    );
                    setError("Could not load your communities and groups.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchPostLocations();
        }
    }, [open, locations.length]);

    // Function to handle the "Photo" button click (legacy)
    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Function to handle file selection from the dialog (legacy)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFileInputError(null);
            const files = Array.from(event.target.files);

            // Validation
            files.forEach((file: File) => {
                if (
                    file.type !== "image/png" &&
                    file.type !== "image/jpeg" &&
                    file.type !== "image/gif" &&
                    file.type !== "image/jpg"
                ) {
                    setFileInputError("Invalid file type: " + file.type);
                }
            });

            if (files.length > 5) {
                setFileInputError("Maximum 5 images are allowed.");
            }

            const newFiles = files.slice(0, 5 - selectedFiles.length);
            setSelectedFiles((prevFiles) =>
                [...prevFiles, ...newFiles].slice(0, 5),
            );
        }
        // Reset the input value to allow selecting the same file again
        event.target.value = "";
    };

    // Function to remove a selected image preview
    const handleRemoveImage = (indexToRemove: number) => {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove),
        );
    };

    // New image handling functions
    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map((file) => ({
                ...file,
                preview: URL.createObjectURL(file),
            }));
            setImages([...images, ...newFiles]);
        }
    };

    const handleAddVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map((file) => ({
                ...file,
                preview: URL.createObjectURL(file),
            }));
            setVideos([...videos, ...newFiles]);
        }
    };

    const handleAddPollOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, ""]);
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const updated = [...pollOptions];
        updated[index] = value;
        setPollOptions(updated);
    };

    const handlePollClick = () => {
        setMode("poll");
        setImages([]);
        setVideos([]);
    };

    const handleCancelPoll = () => {
        setMode("default");
        setPollOptions([""]);
    };

    // Reset all component state when the modal is closed
    const handleModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            setPostContent("");
            setSelectedFiles([]);
            setPostLocationId(undefined);
            setImages([]);
            setVideos([]);
            setPollOptions([""]);
            setMode("default");

            // Clean up object URLs
            revokeObjectUrls();
        }
        onOpenChange(isOpen);
    };

    // Handle submission of post data
    const handleSubmit = async () => {
        if (!postContent.trim() && selectedFiles.length === 0) return;

        setIsUploading(true);
        const uploadedImageUrls: string[] = [];

        try {
            // Upload images (using both old and new image arrays)
            const allImages = selectedFiles;

            if (allImages.length > 0) {
                await Promise.all(
                    allImages.map(async (file) => {
                        const { data: signedUrlData } = await api.post(
                            "/upload/signed-url",
                            {
                                fileName: file.name,
                                fileType: file.type,
                            },
                        );

                        const { signedUrl, path } = signedUrlData.data;

                        await fetch(signedUrl, {
                            method: "PUT",
                            headers: { "Content-Type": file.type },
                            body: file,
                        });

                        const { data: publicUrlData } = supabaseAdmin.storage
                            .from("images")
                            .getPublicUrl(path);
                        uploadedImageUrls.push(publicUrlData.publicUrl);
                    }),
                );
            }

            const postIn = locations.find((loc) => loc.id === postLocationId);

            if (!postIn) {
                throw new Error("Post location not found");
            }

            const postData = {
                content: postContent,
                communityId:
                    postIn.type === "community" ? postLocationId : null,
                groupId: postIn.type === "group" ? postLocationId : null,
                images: uploadedImageUrls,
            };

            await api.post("/posts", postData);
            handleModalClose(false);
        } catch (err) {
            console.error("Failed to create post:", err);
        } finally {
            setIsUploading(false);
        }
    };

    // Clean up object URLs
    const revokeObjectUrls = () => {
        images.forEach(
            (image) => image.preview && URL.revokeObjectURL(image.preview),
        );
        videos.forEach(
            (video) => video.preview && URL.revokeObjectURL(video.preview),
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleModalClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-lg">
                <DialogHeader className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold">
                            {mode === "poll" ? "Create Poll" : "Create Post"}
                        </DialogTitle>
                        <button
                            type="button"
                            onClick={() => {
                                revokeObjectUrls();
                                onOpenChange(false);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="px-6 py-4">
                    <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                                {user
                                    ? `${user.firstName[0]}${user.lastName[0]}`
                                    : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">
                                {user
                                    ? `${user.firstName} ${user.lastName}`
                                    : "User"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {user?.universityName}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder={
                                mode === "poll"
                                    ? "Ask a question for your poll..."
                                    : "What's on your mind..."
                            }
                            className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            aria-label="Post content"
                        />

                        {/* Image Preview Grid */}
                        {fileInputError && (
                            <div className="text-red-600">{fileInputError}</div>
                        )}

                        {!fileInputError && (
                            <>
                                {selectedFiles.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        file,
                                                    )} // Create a temporary URL for preview
                                                    alt={`preview ${index}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                    // Revoke the object URL when the component unmounts to prevent memory leaks
                                                    onLoad={(e) =>
                                                        URL.revokeObjectURL(
                                                            e.currentTarget.src,
                                                        )
                                                    }
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 hover:bg-opacity-75"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Video Preview Grid */}
                        {videos.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {videos.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <video
                                            src={file.preview}
                                            className="w-full h-24 object-cover rounded-lg"
                                            controls={false}
                                            muted
                                        />
                                        <button
                                            onClick={() => {
                                                const newVideos = [...videos];
                                                if (newVideos[index].preview) {
                                                    URL.revokeObjectURL(
                                                        newVideos[index]
                                                            .preview!,
                                                    );
                                                }
                                                newVideos.splice(index, 1);
                                                setVideos(newVideos);
                                            }}
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 hover:bg-opacity-75"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Poll Options */}
                        {mode === "poll" && (
                            <div className="space-y-2">
                                {pollOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) =>
                                                handlePollOptionChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 p-2 border border-gray-200 rounded"
                                            aria-label={`Poll option ${index + 1}`}
                                        />
                                        {pollOptions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [
                                                        ...pollOptions,
                                                    ];
                                                    updated.splice(index, 1);
                                                    setPollOptions(updated);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label={`Remove option ${index + 1}`}
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={handleAddPollOption}
                                        className="text-sm"
                                        variant="outline"
                                        disabled={pollOptions.length >= 4}
                                    >
                                        Add Option
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={handleCancelPoll}
                                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Cancel Poll
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between py-3 border-y border-gray-200">
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                                    <ImageIcon className="w-5 h-5" />
                                    <span className="text-sm">Photo</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        aria-label="Upload images"
                                    />
                                </label>

                                <label className="flex items-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                                    <Video className="w-5 h-5" />
                                    <span className="text-sm">Video</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="video/*"
                                        onChange={handleAddVideo}
                                        className="hidden"
                                        aria-label="Upload videos"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handlePollClick}
                                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                                    aria-label="Create poll"
                                >
                                    <BarChart2 className="w-5 h-5" />
                                    <span className="text-sm">Poll</span>
                                </button>
                            </div>
                        </div>

                        {/* Hidden file input for legacy support */}
                        <input
                            type="file"
                            name="images"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                            accept="image/png, image/jpeg, image/gif, image/jpg"
                        />

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Visibility:
                                    </span>
                                    <Select
                                        defaultValue="private"
                                        onValueChange={(value) =>
                                            setPostVisibility(value)
                                        }
                                    >
                                        <SelectTrigger className="w-28 h-8 border border-gray-300 bg-white shadow-sm hover:bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-300 shadow-md">
                                            <SelectItem
                                                value="private"
                                                className="hover:bg-gray-100 focus:bg-gray-100"
                                            >
                                                Private
                                            </SelectItem>
                                            <SelectItem
                                                value="public"
                                                className="hover:bg-gray-100 focus:bg-gray-100"
                                            >
                                                Public
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Post On:
                                    </span>
                                    <Select
                                        value={postLocationId}
                                        onValueChange={(value) =>
                                            setPostLocationId(value)
                                        }
                                    >
                                        <SelectTrigger className="w-48 h-8 border border-gray-300 bg-white shadow-sm hover:bg-white">
                                            <SelectValue
                                                placeholder={
                                                    isLoading
                                                        ? "Loading..."
                                                        : "Select a location"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-300 shadow-md">
                                            {isLoading && (
                                                <SelectItem
                                                    value="loading"
                                                    disabled
                                                >
                                                    Loading...
                                                </SelectItem>
                                            )}
                                            {error && (
                                                <SelectItem
                                                    value="error"
                                                    disabled
                                                >
                                                    {error}
                                                </SelectItem>
                                            )}

                                            {!isLoading && !error && (
                                                <>
                                                    {locations.length > 0 &&
                                                        locations.map((loc) => (
                                                            <SelectItem
                                                                key={loc.id}
                                                                value={loc.id}
                                                            >
                                                                {loc.name}
                                                            </SelectItem>
                                                        ))}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={
                                        isUploading ||
                                        (!postContent.trim() &&
                                            selectedFiles.length === 0 &&
                                            images.length === 0) ||
                                        (mode === "poll" &&
                                            pollOptions.some(
                                                (opt) => !opt.trim(),
                                            ))
                                    }
                                    className="bg-purple-700 hover:bg-purple-800 text-white"
                                >
                                    {isUploading ? (
                                        <Loader2 className="animate-spin mr-2" />
                                    ) : null}
                                    {isUploading ? "Posting..." : "Post"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
