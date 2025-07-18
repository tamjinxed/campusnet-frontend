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
      
      <div className="max-w-7xl mx-auto flex gap-4 md:gap-6 p-4 md:p-6">
        {/* Left Sidebar - Hidden on mobile, shown on md and larger */}
        <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
          <LeftSidebar />
        </div>

        <main className="flex-1 overflow-x-hidden">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 md:p-6 border-b">
              <h1 className="text-lg md:text-xl font-semibold">Saved Items</h1>
            </div>
            
            <div className="divide-y">
              {savedItems.map((item) => (
                <div key={item.id} className="p-4 md:p-6 flex gap-3 md:gap-4">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-sm md:text-base">
                      {item.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{item.author}</h3>
                        <p className="text-xs md:text-sm text-gray-600">{item.role}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1 md:p-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-700 mt-2 md:mt-3 text-sm md:text-base leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                    
                    <div className="mt-2 md:mt-4">
                      <img 
                        src={item.image} 
                        alt="Post content" 
                        className="w-16 h-12 md:w-20 md:h-16 rounded-lg object-cover"
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