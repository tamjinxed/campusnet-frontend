"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Separator } from "@/app/components/ui/separator"
import { Badge } from "@/app/components/ui/badge"
import { TopHeader } from "@/app/components/layout/topheader"
import { CreatePostModal } from "@/app/components/modals/CreatePostModal"
import {
    Edit,
    Plus,
    GraduationCap,
    Award,
    Upload,
    User,
    Trash2,
    MapPin,
    Calendar,
    Phone,
    Mail,
    University,
    Eye,
    EyeOff,
    Settings,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import api from "@/app/lib/axios"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "react-hot-toast"
import {supabaseAdmin} from "@/app/lib/supabase";

// Interfaces matching your backend structure
interface ProfileData {
    userId: string
    email: string
    username: string
    firstName: string
    lastName: string
    profilePicture: string
    coverPhoto: string
    bio: string
    birthDate: string
    phone: string
    studentId: string
    graduationYear: number
    department: string
    interests: string[]
    address: string
    profileVisibilityPublic: boolean
    connectionVisibilityPublic: boolean
    universityName: string
    universityId: string
    userCreatedAt: string
    lastLogin: string
}

interface Education {
    id: number
    institution: string
    degree: string
    field_of_study: string
    start_date: string
    end_date: string
    description?: string
}

interface Achievement {
    id: number
    title: string
    description: string
    achieved_at: string
    issued_by: string
    credential_url?: string
}

export default function ProfilePage() {
    const router = useRouter()
    const { user, isInitialized } = useAuth()
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const coverPhotoRef = useRef<HTMLInputElement>(null)
    const profilePhotoRef = useRef<HTMLInputElement>(null)

    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [education, setEducation] = useState<Education[]>([])
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isUploadingCover, setIsUploadingCover] = useState(false)
    const [isUploadingProfile, setIsUploadingProfile] = useState(false)

    // Check if current user is viewing their own profile
    const isOwnProfile = user && profileData && user.userId === profileData.userId

    useEffect(() => {
        if (!isInitialized) return

        const fetchAllProfileData = async () => {
            try {
                const [profileRes, educationRes, achievementsRes] = await Promise.all([
                    api.get("/users/me/profile"),
                    api.get("/users/me/profile/education"),
                    api.get("/users/me/profile/achievements"),
                ])

                const profile = profileRes.data.data.profile
                setProfileData({
                    userId: profile.userId,
                    email: profile.email,
                    username: profile.username,
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    profilePicture: profile.profilePicture || "",
                    coverPhoto: profile.coverPhoto || "",
                    bio: profile.bio || "",
                    birthDate: profile.birthDate || "",
                    phone: profile.phone || "",
                    studentId: profile.studentId || "",
                    graduationYear: profile.graduationYear || new Date().getFullYear(),
                    department: profile.department || "",
                    interests: profile.interests || [],
                    address: profile.address || "",
                    profileVisibilityPublic: profile.profileVisibilityPublic ?? true,
                    connectionVisibilityPublic: profile.connectionVisibilityPublic ?? true,
                    universityName: profile.universityName || "",
                    universityId: profile.universityId || "",
                    userCreatedAt: profile.userCreatedAt || "",
                    lastLogin: profile.lastLogin || "",
                })

                setEducation(educationRes.data.data || [])
                setAchievements(achievementsRes.data.data || [])
            } catch (err: any) {
                console.error("Failed to load profile data:", err)
                setError("Failed to load profile data.")
                toast.error("Failed to load profile data")
            } finally {
                setLoading(false)
            }
        }

        fetchAllProfileData()
    }, [isInitialized])

    const uploadFile = async (file: File, type: "profile" | "cover") => {
        try {
            const { data : signedUrlData } = await api.post("/upload/signed-url", {
                fileName: file?.name,
                fileType: file?.type,
            });

            const { signedUrl, path } = signedUrlData.data;

            await fetch(signedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            const { data: publicUrlData } = supabaseAdmin.storage
                .from("images")
                .getPublicUrl(path);

            return publicUrlData.publicUrl;
        } catch (error) {
            console.error(`${type} upload failed:`, error)
            toast.error(`Failed to upload ${type} photo`)
            throw error
        }
    }

    const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isOwnProfile) return
        if (e.target.files?.[0] && profileData) {
            const file = e.target.files[0]
            setIsUploadingCover(true)

            try {
                const imageUrl = await uploadFile(file, "cover")
                await api.put("/users/me/profile", { cover_photo: imageUrl })
                setProfileData({ ...profileData, coverPhoto: imageUrl })
                toast.success("Cover photo updated successfully")
            } catch (err) {
                // Error already handled in uploadFile
            } finally {
                setIsUploadingCover(false)
            }
        }
    }

    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isOwnProfile) return
        if (e.target.files?.[0] && profileData) {
            const file = e.target.files[0]
            setIsUploadingProfile(true)

            try {
                const imageUrl = await uploadFile(file, "profile")
                await api.put("/users/me/profile", { profile_picture: imageUrl })
                setProfileData({ ...profileData, profilePicture: imageUrl })
                toast.success("Profile photo updated successfully")
            } catch (err) {
                // Error already handled in uploadFile
            } finally {
                setIsUploadingProfile(false)
            }
        }
    }

    const handleDeleteCoverPhoto = async () => {
        if (!isOwnProfile || !profileData) return
        try {
            await api.put("/users/me/profile", { cover_photo: "" })
            setProfileData({ ...profileData, coverPhoto: "" })
            toast.success("Cover photo removed")
        } catch (err) {
            toast.error("Failed to remove cover photo")
        }
    }

    const handleDeleteProfilePhoto = async () => {
        if (!isOwnProfile || !profileData) return
        try {
            await api.put("/users/me/profile", { profile_picture: "" })
            setProfileData({ ...profileData, profilePicture: "" })
            toast.success("Profile photo removed")
        } catch (err) {
            toast.error("Failed to remove profile photo")
        }
    }

    if (!isInitialized || loading) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error && !profileData) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                </div>
            </div>
        )
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p>No profile data found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted">
            <TopHeader />

            <div className="container mx-auto px-4 py-6">
                {/* Cover Photo and Profile Photo Section */}
                <div className="relative w-full mb-16">
                    {/* Cover Photo */}
                    <div className="h-64 w-full rounded-t-lg overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 relative group">
                        {isOwnProfile && (
                            <input
                                type="file"
                                ref={coverPhotoRef}
                                onChange={handleCoverPhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        )}

                        {profileData.coverPhoto ? (
                            <Image
                                src={profileData.coverPhoto || "/placeholder.svg"}
                                alt="Cover"
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="h-full w-full campus-gradient flex items-center justify-center">
                                <div className="text-center text-white">
                                    <University className="w-16 h-16 mx-auto mb-4 opacity-70" />
                                    <span className="text-lg font-medium opacity-70">
                    {profileData.universityName || "University Profile"}
                  </span>
                                </div>
                            </div>
                        )}

                        {/* Cover Photo Edit Overlay - Only for own profile */}
                        {isOwnProfile && (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="bg-white/90 hover:bg-white text-gray-800"
                                            onClick={() => coverPhotoRef.current?.click()}
                                            disabled={isUploadingCover}
                                        >
                                            {isUploadingCover ? "Uploading..." : "Upload Cover"}
                                        </Button>
                                        {profileData.coverPhoto && (
                                            <Button
                                                variant="outline"
                                                className="bg-white/90 hover:bg-white text-gray-800"
                                                onClick={handleDeleteCoverPhoto}
                                                disabled={isUploadingCover}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4">
                                    <Button
                                        variant="ghost"
                                        className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                                        onClick={() => coverPhotoRef.current?.click()}
                                        disabled={isUploadingCover}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Cover
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile Photo */}
                    <div className="absolute -bottom-16 left-6">
                        {isOwnProfile ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden cursor-pointer shadow-lg group">
                                        {isUploadingProfile ? (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : profileData.profilePicture ? (
                                            <Image
                                                src={profileData.profilePicture || "/placeholder.svg"}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full campus-gradient flex items-center justify-center">
                                                <User className="w-16 h-16 text-white" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                            <Edit className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48 bg-white">
                                    <DropdownMenuItem onClick={() => profilePhotoRef.current?.click()} disabled={isUploadingProfile}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Photo
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => window.open(profileData.profilePicture, "_blank")}
                                        disabled={!profileData.profilePicture}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Photo
                                    </DropdownMenuItem>
                                    {profileData.profilePicture && (
                                        <DropdownMenuItem onClick={handleDeleteProfilePhoto} className="text-red-500">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove Photo
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                                {profileData.profilePicture ? (
                                    <Image
                                        src={profileData.profilePicture || "/placeholder.svg"}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full campus-gradient flex items-center justify-center">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>
                        )}

                        {isOwnProfile && (
                            <input
                                type="file"
                                ref={profilePhotoRef}
                                onChange={handleProfilePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        )}
                    </div>
                </div>

                {/* Profile Header */}
                <Card className="mb-6 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold campus-gradient-text">
                                        {`${profileData.firstName} ${profileData.lastName}`}
                                    </h1>
                                    {!profileData.profileVisibilityPublic && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <EyeOff className="w-3 h-3" />
                                            Private
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-lg text-muted-foreground mb-4 max-w-2xl">{profileData.bio}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <University className="w-4 h-4 text-primary" />
                                        <span className="font-medium">{profileData.universityName}</span>
                                    </div>

                                    {profileData.department && (
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-primary" />
                                            <span>{profileData.department}</span>
                                        </div>
                                    )}

                                    {profileData.graduationYear && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>Class of {profileData.graduationYear}</span>
                                        </div>
                                    )}

                                    {/* Show additional info only to authenticated users or profile owner */}
                                    {(isOwnProfile || user) && (
                                        <>
                                            {profileData.address && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    <span>{profileData.address}</span>
                                                </div>
                                            )}

                                            {profileData.phone && isOwnProfile && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                    <span>{profileData.phone}</span>
                                                </div>
                                            )}

                                            {profileData.email && isOwnProfile && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-primary" />
                                                    <span>{profileData.email}</span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span>Joined {new Date(profileData.userCreatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons - Only for own profile */}
                            {isOwnProfile && (
                                <div className="flex gap-2">
                                    <Link href="/profile/edit">
                                        <Button className="campus-gradient">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                    <Button variant="outline" onClick={() => setIsPostModalOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Post
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Separator className="my-6" />

                        {/* Stats Section */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-2xl font-bold campus-gradient-text">{education.length}</p>
                                    <p className="text-sm text-muted-foreground">Education</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold campus-gradient-text">{achievements.length}</p>
                                    <p className="text-sm text-muted-foreground">Achievements</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold campus-gradient-text">{profileData.interests.length}</p>
                                    <p className="text-sm text-muted-foreground">Interests</p>
                                </div>
                            </div>

                            {/* Student ID - Only for authenticated users */}
                            {(isOwnProfile || user) && profileData.studentId && (
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Student ID</p>
                                    <p className="font-mono font-medium">{profileData.studentId}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Education & Achievements */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Education Section */}
                        <Card className="shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                    Education
                                </CardTitle>
                                {isOwnProfile && (
                                    <Link href="/profile/edit">
                                        <Button variant="ghost" size="sm">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </CardHeader>
                            <CardContent>
                                {education.length > 0 ? (
                                    <div className="space-y-6">
                                        {education.map((edu) => (
                                            <div
                                                key={edu.id}
                                                className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full campus-gradient flex items-center justify-center">
                                                    <GraduationCap className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-lg">{edu.institution}</h3>
                                                    <p className="text-primary font-medium">{edu.degree}</p>
                                                    {edu.field_of_study && <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>}
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>
                              {edu.start_date && new Date(edu.start_date).getFullYear()} -{" "}
                                                            {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                            </span>
                                                    </div>
                                                    {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                        <p className="text-muted-foreground">No education information available</p>
                                        {isOwnProfile && (
                                            <Link href="/profile/edit">
                                                <Button variant="outline" className="mt-4 bg-transparent">
                                                    Add Education
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Achievements Section */}
                        <Card className="shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    Achievements
                                </CardTitle>
                                {isOwnProfile && (
                                    <Link href="/profile/edit">
                                        <Button variant="ghost" size="sm">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </CardHeader>
                            <CardContent>
                                {achievements.length > 0 ? (
                                    <div className="space-y-6">
                                        {achievements.map((achievement) => (
                                            <div
                                                key={achievement.id}
                                                className="flex items-start gap-4 p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors border border-yellow-200"
                                            >
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                                                    <Award className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-lg">{achievement.title}</h3>
                                                    <p className="text-yellow-700 font-medium">{achievement.issued_by}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(achievement.achieved_at).toLocaleDateString()}</span>
                                                    </div>
                                                    {achievement.credential_url && (
                                                        <a
                                                            href={achievement.credential_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            View Credential
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                        <p className="text-muted-foreground">No achievements to display</p>
                                        {isOwnProfile && (
                                            <Link href="/profile/edit">
                                                <Button variant="outline" className="mt-4 bg-transparent">
                                                    Add Achievement
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Interests & Additional Info */}
                    <div className="space-y-6">
                        {/* Interests Section */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Interests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profileData.interests && profileData.interests.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.interests.map((interest, index) => (
                                            <Badge key={index} variant="secondary" className="campus-gradient text-white">
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No interests listed</p>
                                        {isOwnProfile && (
                                            <Link href="/profile/edit">
                                                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                                    Add Interests
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Privacy Settings - Only for own profile */}
                        {isOwnProfile && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Privacy Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {profileData.profileVisibilityPublic ? (
                                                <Eye className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className="text-sm">Profile Visibility</span>
                                        </div>
                                        <Badge variant={profileData.profileVisibilityPublic ? "default" : "secondary"}>
                                            {profileData.profileVisibilityPublic ? "Public" : "Private"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {profileData.connectionVisibilityPublic ? (
                                                <Eye className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className="text-sm">Connections Visibility</span>
                                        </div>
                                        <Badge variant={profileData.connectionVisibilityPublic ? "default" : "secondary"}>
                                            {profileData.connectionVisibilityPublic ? "Public" : "Private"}
                                        </Badge>
                                    </div>
                                    <Link href="/profile/edit">
                                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Manage Privacy
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Stats */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Profile Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Profile Completeness</span>
                                    <span className="font-medium">
                    {Math.round(
                        (((profileData.firstName ? 1 : 0) +
                                (profileData.lastName ? 1 : 0) +
                                (profileData.bio ? 1 : 0) +
                                (profileData.profilePicture ? 1 : 0) +
                                (education.length > 0 ? 1 : 0) +
                                (profileData.interests.length > 0 ? 1 : 0)) /
                            6) *
                        100,
                    )}
                                        %
                  </span>
                                </div>
                                {profileData.lastLogin && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Last Active</span>
                                        <span className="text-sm">{new Date(profileData.lastLogin).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Member Since</span>
                                    <span className="text-sm">{new Date(profileData.userCreatedAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Create Post Modal - Only for own profile */}
            {isOwnProfile && <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />}
        </div>
    )
}
