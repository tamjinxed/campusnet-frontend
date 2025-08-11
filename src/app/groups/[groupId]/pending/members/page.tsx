"use client"

import React, { useEffect, useState } from "react"
import { ArrowLeft, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog"

import { TopHeader } from "@/app/components/layout/topheader"
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar"
import api from "@/app/lib/axios"
import { useAuth } from "@/app/context/AuthContext"
import {numericStringToUuid, uuidToNumericString} from "@/app/utils/utils"
import { toast } from "react-hot-toast"

interface JoinRequest {
    requestId: string
    groupId: string
    userId: string
    status: "pending" | "approved" | "rejected"
    requestedAt: string
    username: string
    email: string
    firstName: string
    lastName: string
    profilePicture: string
    bio: string
    universityName: string
}

interface Group {
    id: string
    name: string
    description: string
}

const PendingMembers = ({ params }: { params: Promise<{ groupId: string }> }) => {
    let { groupId } = React.use(params)
    groupId = numericStringToUuid(groupId)
    const { user } = useAuth()
    const router = useRouter()

    const [group, setGroup] = useState<Group | null>(null)
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user, groupId])

    const fetchData = async () => {
        try {
            setLoading(true)
            await Promise.all([fetchGroupInfo(), fetchJoinRequests()])
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    const fetchGroupInfo = async () => {
        try {
            const { data } = await api.get(`/groups/${groupId}`)
            setGroup(data.data.group)
        } catch (error) {
            console.error("Error fetching group info:", error)
        }
    }

    const fetchJoinRequests = async () => {
        try {
            const { data } = await api.get(`/groups/${groupId}/member-requests?page=1&limit=100`)
            const pendingRequests = data.data.requests.filter((req: JoinRequest) => req.status === "pending")
            setJoinRequests(pendingRequests)
        } catch (error) {
            console.error("Error fetching join requests:", error)
        }
    }

    const handleApprove = async (requestId: string) => {
        try {
            await api.post(`/groups/${groupId}/member-requests/${requestId}/approve`)
            toast.success("Member request approved!")
            await fetchJoinRequests()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to approve request")
        }
    }

    const handleReject = async (requestId: string, reason?: string) => {
        try {
            await api.post(`/groups/${groupId}/member-requests/${requestId}/reject`, {
                reason: reason || "No reason provided",
            })
            toast.success("Member request rejected")
            await fetchJoinRequests()
            setSelectedRequest(null)
            setRejectReason("")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reject request")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted">
            <TopHeader />

            <div className="flex">
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center mb-6">
                            <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.push(`/groups/${uuidToNumericString(groupId)}`)}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold campus-gradient-text">Pending Member Requests</h1>
                                <p className="text-muted-foreground">
                                    Review and approve new members for {group?.name || "this group"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {joinRequests.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                                <Check className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                                            <p className="text-muted-foreground">All member requests have been reviewed.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                joinRequests.map((request) => (
                                    <Card key={request.requestId}>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarImage src={request.profilePicture || "/placeholder.svg"} />
                                                        <AvatarFallback className="campus-gradient text-white">
                                                            {request.firstName[0]}
                                                            {request.lastName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold">
                                                            {request.firstName} {request.lastName}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">{request.universityName}</p>
                                                        <div className="flex items-center space-x-4 mt-1">
                                                            <p className="text-xs text-muted-foreground">
                                                                Requested {new Date(request.requestedAt).toLocaleDateString()}
                                                            </p>
                                                            <Badge variant="secondary">Pending</Badge>
                                                        </div>
                                                        {request.bio && (
                                                            <p className="text-sm text-muted-foreground mt-2 max-w-md">{request.bio}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(request.requestId)}
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedRequest(request)}
                                                        className="border-red-300 hover:bg-red-50"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Rejection Modal */}
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Decline Join Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to decline {selectedRequest?.firstName} {selectedRequest?.lastName}'s request to
                            join this group?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reason">Reason (optional)</Label>
                            <Textarea
                                id="reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for declining..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedRequest && handleReject(selectedRequest.requestId, rejectReason)}
                        >
                            Decline Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PendingMembers
