export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
              EM
            </div>
            <span className="text-lg font-bold text-purple-600">EventMaster</span>
          </div>

          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Help Center
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Terms of Service
            </a>
          </div>

          <p className="text-gray-500 text-sm">© 2023 EventMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
