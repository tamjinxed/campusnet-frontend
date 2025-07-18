import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const SavedItems = () => {
  const savedItems = [
    {
      id: 1,
      author: "John Doe",
      role: "AICD University, Bangladesh",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      author: "John Doe",
      role: "AICD University, Bangladesh", 
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      author: "John Doe",
      role: "AICD University, Bangladesh",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      
      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        <LeftSidebar />

        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h1 className="text-xl font-semibold">Saved Items</h1>
            </div>
            
            <div className="divide-y">
              {savedItems.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {item.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.author}</h3>
                        <p className="text-sm text-gray-600">{item.role}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-700 mt-3 leading-relaxed">{item.content}</p>
                    
                    <div className="mt-4">
                      <img 
                        src={item.image} 
                        alt="Post content" 
                        className="w-20 h-16 rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SavedItems;