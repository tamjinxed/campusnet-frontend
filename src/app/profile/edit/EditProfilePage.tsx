"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { TopHeader } from "@/app/components/layout/topheader"
import { Edit, Plus, GraduationCap, Award, User, X, Eye, Check, Trash2, Calendar, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/app/components/ui/textarea"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Switch } from "@/app/components/ui/switch"
import api from "@/app/lib/axios"
import { useRouter } from "next/navigation"
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
}

interface Education {
    id: number
    institution: string
    degree: string
    field_of_study: string
    start_date: string
    end_date: string
}

interface Achievement {
    id: number
    title: string
    description: string
    achieved_at: string
    issued_by: string
    credential_url?: string
}

export default function EditProfilePage() {
    const router = useRouter()
    const coverPhotoRef = useRef<HTMLInputElement>(null)
    const profilePhotoRef = useRef<HTMLInputElement>(null)

    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [education, setEducation] = useState<Education[]>([])
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [newInterest, setNewInterest] = useState("")

    const [isUploadingCover, setIsUploadingCover] = useState(false)
    const [isUploadingProfile, setIsUploadingProfile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfileData = async () => {
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
        fetchProfileData()
    }, [])

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
        if (e.target.files?.[0] && profileData) {
            const file = e.target.files[0]
            setIsUploadingCover(true)

            try {
                const imageUrl = await uploadFile(file, "cover")
                setProfileData({ ...profileData, coverPhoto: imageUrl })
                toast.success("Cover photo uploaded successfully")
            } catch (err) {
                // Error already handled in uploadFile
            } finally {
                setIsUploadingCover(false)
            }
        }
    }

    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0] && profileData) {
            const file = e.target.files[0]
            setIsUploadingProfile(true)

            try {
                const imageUrl = await uploadFile(file, "profile")
                setProfileData({ ...profileData, profilePicture: imageUrl })
                toast.success("Profile photo uploaded successfully")
            } catch (err) {
                // Error already handled in uploadFile
            } finally {
                setIsUploadingProfile(false)
            }
        }
    }

    const removeCoverPhoto = () => {
        if (profileData) {
            setProfileData({ ...profileData, coverPhoto: "" })
        }
    }

    const removeProfilePhoto = () => {
        if (profileData) {
            setProfileData({ ...profileData, profilePicture: "" })
        }
    }

    const handleEducationChange = (index: number, field: keyof Education, value: string) => {
        const newEducation = [...education]
        ;(newEducation[index] as any)[field] = value
        setEducation(newEducation)
    }

    const addEducation = () => {
        setEducation([
            ...education,
            {
                id: Date.now(), // Temporary ID for new items
                institution: "",
                degree: "",
                field_of_study: "",
                start_date: "",
                end_date: "",
            },
        ])
    }

    const removeEducation = async (id: number, index: number) => {
        // If the ID is a temporary one (new item), just remove from state
        if (id > 1000000000) {
            // Temporary ID check
            setEducation(education.filter((_, i) => i !== index))
            return
        }

        // Otherwise, send a delete request
        try {
            await api.delete(`/users/me/profile/education/${id}`)
            setEducation(education.filter((_, i) => i !== index))
            toast.success("Education deleted successfully")
        } catch (err) {
            console.error("Failed to delete education:", err)
            toast.error("Failed to delete education")
        }
    }

    const handleAchievementChange = (index: number, field: keyof Achievement, value: string) => {
        const newAchievements = [...achievements]
        ;(newAchievements[index] as any)[field] = value
        setAchievements(newAchievements)
    }

    const addAchievement = () => {
        setAchievements([
            ...achievements,
            {
                id: Date.now(), // Temporary ID for new items
                title: "",
                description: "",
                achieved_at: "",
                issued_by: "",
                credential_url: "",
            },
        ])
    }

    const removeAchievement = async (id: number, index: number) => {
        // If the ID is a temporary one (new item), just remove from state
        if (id > 1000000000) {
            // Temporary ID check
            setAchievements(achievements.filter((_, i) => i !== index))
            return
        }

        // Otherwise, send a delete request
        try {
            await api.delete(`/users/me/profile/achievements/${id}`)
            setAchievements(achievements.filter((_, i) => i !== index))
            toast.success("Achievement deleted successfully")
        } catch (err) {
            console.error("Failed to delete achievement:", err)
            toast.error("Failed to delete achievement")
        }
    }

    const addInterest = () => {
        if (newInterest.trim() && profileData && !profileData.interests.includes(newInterest.trim())) {
            setProfileData({
                ...profileData,
                interests: [...profileData.interests, newInterest.trim()],
            })
            setNewInterest("")
        }
    }

    const removeInterest = (interest: string) => {
        if (profileData) {
            setProfileData({
                ...profileData,
                interests: profileData.interests.filter((i) => i !== interest),
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profileData) return

        setSaving(true)
        try {
            await api.put("/users/me/profile", {
                first_name: profileData.firstName,
                last_name: profileData.lastName,
                bio: profileData.bio,
                birth_date: profileData.birthDate ? new Date(profileData.birthDate).toISOString() : null,
                phone: profileData.phone,
                student_id: profileData.studentId,
                graduation_year: profileData.graduationYear,
                department: profileData.department,
                interests: profileData.interests,
                address: profileData.address,
                profile_picture: profileData.profilePicture,
                cover_photo: profileData.coverPhoto,
                profile_visibility_public: profileData.profileVisibilityPublic,
                connection_visibility_public: profileData.connectionVisibilityPublic,
            })

            for (const edu of education) {
                if (edu.id > 1000000000) {
                    await api.post("/users/me/profile/education", {
                        university_name: edu.institution,
                        degree: edu.degree,
                        field_of_study: edu.field_of_study,
                        start_date: new Date(edu.start_date).toISOString(),
                        end_date: new Date(edu.end_date).toISOString(),
                    })
                } else {
                    await api.put(`/users/me/profile/education/${edu.id}`, {
                        university_name: edu.institution,
                        degree: edu.degree,
                        field_of_study: edu.field_of_study,
                        start_date: new Date(edu.start_date).toISOString(),
                        end_date: new Date(edu.end_date).toISOString(),
                    })
                }
            }

            // Handle Achievements (add new and update existing)
            for (const achievement of achievements) {
                if (achievement.id > 1000000000) {
                    await api.post("/users/me/profile/achievements", {
                        title: achievement.title,
                        description: achievement.description,
                        date_achieved: new Date(achievement.achieved_at).toISOString(),
                        issued_by: achievement.issued_by,
                        credential_url: achievement.credential_url,
                    })
                } else {
                    // Existing achievement item
                    await api.put(`/users/me/profile/achievements/${achievement.id}`, {
                        title: achievement.title,
                        description: achievement.description,
                        date_achieved: new Date(achievement.achieved_at).toISOString(),
                        issued_by: achievement.issued_by,
                        credential_url: achievement.credential_url,
                    })
                }
            }

            toast.success("Profile updated successfully!")
            router.push("/profile")
        } catch (err: any) {
            console.error("Failed to save profile:", err)
            const errorMessage = err.response?.data?.message || "Failed to save profile. Please try again."
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setSaving(false)
        }
    }

    if (loading)
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

    if (error && !profileData)
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

    if (!profileData) return null

    return (
        <div className="min-h-screen bg-muted">
            <TopHeader />

            <div className="container mx-auto px-4 py-6">
                <form onSubmit={handleSubmit}>
                    {/* Cover + Profile Photo Section */}
                    <div className="relative w-full mb-16">
                        {/* Cover Photo */}
                        <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gray-200 relative group">
                            <input
                                type="file"
                                ref={coverPhotoRef}
                                onChange={handleCoverPhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />

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
                                    <span className="text-white text-lg font-medium opacity-70">Add a cover photo</span>
                                </div>
                            )}

                            {/* Cover Photo Edit Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white/90 hover:bg-white text-gray-800"
                                        onClick={() => coverPhotoRef.current?.click()}
                                        disabled={isUploadingCover}
                                    >
                                        {isUploadingCover ? "Uploading..." : "Upload Cover"}
                                    </Button>
                                    {profileData.coverPhoto && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-white/90 hover:bg-white text-gray-800"
                                            onClick={removeCoverPhoto}
                                            disabled={isUploadingCover}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Semi-transparent Edit Cover Button */}
                            <div className="absolute top-4 right-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                                    onClick={() => coverPhotoRef.current?.click()}
                                    disabled={isUploadingCover}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Cover
                                </Button>
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div className="absolute -bottom-16 left-6">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden cursor-pointer shadow-md group">
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
                                                <User className="w-12 h-12 text-white" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                            <Edit className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    <DropdownMenuItem onClick={() => profilePhotoRef.current?.click()} disabled={isUploadingProfile}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile Photo
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => window.open(profileData.profilePicture, "_blank")}
                                        disabled={!profileData.profilePicture}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Profile Photo
                                    </DropdownMenuItem>
                                    {profileData.profilePicture && (
                                        <DropdownMenuItem
                                            onClick={removeProfilePhoto}
                                            className="text-red-500"
                                            disabled={isUploadingProfile}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Photo
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <input
                                type="file"
                                ref={profilePhotoRef}
                                onChange={handleProfilePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={profileData.email} disabled className="bg-gray-50" />
                                </div>
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" value={profileData.username} disabled className="bg-gray-50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="birthDate">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Birth Date
                                    </Label>
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={profileData.birthDate
                                            ? new Date(profileData.birthDate).toISOString().split("T")[0]
                                            : ""}
                                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="address">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Address
                                </Label>
                                <Input
                                    id="address"
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    placeholder="Your address"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Info Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="studentId">Student ID</Label>
                                    <Input
                                        id="studentId"
                                        value={profileData.studentId}
                                        onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })}
                                        placeholder="Your student ID"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="graduationYear">Graduation Year</Label>
                                    <Input
                                        id="graduationYear"
                                        type="number"
                                        value={profileData.graduationYear}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                graduationYear: Number.parseInt(e.target.value) || new Date().getFullYear(),
                                            })
                                        }
                                        min="1900"
                                        max="2100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="university">University</Label>
                                    <Input id="university" value={profileData.universityName} disabled className="bg-gray-50" />
                                </div>
                                <div>
                                    <Label htmlFor="department">Department/Major</Label>
                                    <Input
                                        id="department"
                                        value={profileData.department}
                                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                                        placeholder="Your major/department"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="profileVisibility">Public Profile</Label>
                                    <p className="text-sm text-gray-500">Make your profile visible to everyone</p>
                                </div>
                                <Switch
                                    id="profileVisibility"
                                    checked={profileData.profileVisibilityPublic}
                                    onCheckedChange={(checked) => setProfileData({ ...profileData, profileVisibilityPublic: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="connectionVisibility">Public Connections</Label>
                                    <p className="text-sm text-gray-500">Make your connections visible to everyone</p>
                                </div>
                                <Switch
                                    id="connectionVisibility"
                                    checked={profileData.connectionVisibilityPublic}
                                    onCheckedChange={(checked) => setProfileData({ ...profileData, connectionVisibilityPublic: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Education</span>
                                <Button variant="ghost" size="sm" type="button" onClick={addEducation}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={edu.id} className="flex items-start gap-3 group border rounded-lg p-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                                        <GraduationCap className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <Input
                                                value={edu.institution}
                                                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                                placeholder="Institution"
                                            />
                                            <Input
                                                value={edu.degree}
                                                onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                                                placeholder="Degree"
                                            />
                                        </div>
                                        <Input
                                            value={edu.field_of_study}
                                            onChange={(e) => handleEducationChange(index, "field_of_study", e.target.value)}
                                            placeholder="Field of Study"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <Label>Start Date</Label>
                                                <Input
                                                    type="date"
                                                    value={edu.start_date
                                                        ? new Date(edu.start_date).toISOString().split("T")[0]
                                                        : ""}
                                                    onChange={(e) => handleEducationChange(index, "start_date", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>End Date</Label>
                                                <Input
                                                    type="date"
                                                    value={edu.end_date
                                                        ? new Date(edu.end_date).toISOString().split("T")[0]
                                                        : ""}
                                                    onChange={(e) => handleEducationChange(index, "end_date", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={() => removeEducation(edu.id, index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {education.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No education entries yet. Click the + button to add one.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Achievements Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Achievements</span>
                                <Button variant="ghost" size="sm" type="button" onClick={addAchievement}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {achievements.map((achievement, index) => (
                                <div key={achievement.id} className="flex items-start gap-3 group border rounded-lg p-4">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mt-1">
                                        <Award className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <Input
                                                value={achievement.title}
                                                onChange={(e) => handleAchievementChange(index, "title", e.target.value)}
                                                placeholder="Achievement Title"
                                            />
                                            <Input
                                                value={achievement.issued_by}
                                                onChange={(e) => handleAchievementChange(index, "issued_by", e.target.value)}
                                                placeholder="Issued By"
                                            />
                                        </div>
                                        <Textarea
                                            value={achievement.description}
                                            onChange={(e) => handleAchievementChange(index, "description", e.target.value)}
                                            placeholder="Description"
                                            rows={2}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <Label>Date Achieved</Label>
                                                <Input
                                                    type="date"
                                                    value={achievement.achieved_at
                                                        ? new Date(achievement.achieved_at).toISOString().split("T")[0]
                                                        : ""}
                                                    onChange={(e) => handleAchievementChange(index, "achieved_at", e.target.value)}
                                                />
                                            </div>
                                            <Input
                                                value={achievement.credential_url || ""}
                                                onChange={(e) => handleAchievementChange(index, "credential_url", e.target.value)}
                                                placeholder="Credential URL (optional)"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={() => removeAchievement(achievement.id, index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {achievements.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No achievements yet. Click the + button to add one.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Interests Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Interests</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    placeholder="Add an interest"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                                />
                                <Button type="button" onClick={addInterest} disabled={!newInterest.trim()}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profileData.interests.map((interest, index) => (
                                    <div
                                        key={index}
                                        className="campus-gradient text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {interest}
                                        <button type="button" onClick={() => removeInterest(interest)} className="hover:text-red-200">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {profileData.interests.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No interests added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4 mb-6">
                        <Link href="/profile">
                            <Button variant="outline" type="button" disabled={saving}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" className="px-8 campus-gradient" disabled={saving}>
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
