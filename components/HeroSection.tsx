import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const HerosSection = () => {

    return (
        <section className="wrapper pt-28 pb-12 px-4 ">
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#f3e4c7] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    {/* Left Section */}
                    <div className="flex-1 z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#212a3b] mb-6">
                            Your Library
                        </h1>
                        <p className="text-lg md:text-xl text-[#3d485e] mb-10 max-w-md leading-relaxed">
                            Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
                        </p>
                        <Link
                            href="/books/new"
                            className="inline-flex items-center gap-2 px-6 py-4 bg-white text-[#212a3b] font-bold rounded-xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add new book</span>
                        </Link>
                    </div>

                    {/* Center Section - Illustration */}
                    <div className="flex-1 flex justify-center items-center z-10 w-full">
                        <div className="relative w-full h-[250px] md:h-[300px]">
                            <Image
                                src="/assets/hero-illustration.png"
                                alt="Vintage books and a globe illustration"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Section - Steps Card */}
                    <div className="w-full md:w-72 z-10">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="space-y-8">
                                {/* Step 1 */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#212a3b] flex items-center justify-center text-[#212a3b] font-medium text-sm">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#212a3b]">Upload PDF</h3>
                                        <p className="text-sm text-[#3d485e]">Add your book file</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#212a3b] flex items-center justify-center text-[#212a3b] font-medium text-sm">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#212a3b]">AI Processing</h3>
                                        <p className="text-sm text-[#3d485e]">We analyze the content</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#212a3b] flex items-center justify-center text-[#212a3b] font-medium text-sm">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#212a3b]">Voice Chat</h3>
                                        <p className="text-sm text-[#3d485e]">Discuss with AI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </section>
    )
}

export default HerosSection
