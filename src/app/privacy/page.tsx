"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowRight, Printer, Info } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <main className="flex flex-col min-h-screen bg-[#FDFDFD]">
            <Navbar />

            <section className="flex-grow pt-32 pb-24">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-semibold mb-6"
                        >
                            <Shield size={16} />
                            <span>Privacy & Trust</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-poppins font-bold text-soft-black mb-6 tracking-tight"
                        >
                            Privacy Policy
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-soft-gray text-lg max-w-2xl mx-auto"
                        >
                            We value your trust and are committed to protecting your personal information.
                            Last updated on <span className="font-semibold text-soft-black">March 01, 2026</span>.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Sidebar Navigation */}
                        <aside className="lg:col-span-4 hidden lg:block sticky top-32 h-fit">
                            <div className="bg-white rounded-2xl shadow-premium border border-gray-100 p-8">
                                <h3 className="text-sm font-bold text-soft-black uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Info size={16} className="text-primary" />
                                    Navigation
                                </h3>
                                <nav className="space-y-1">
                                    {[
                                        { id: "infocollect", label: "Information We Collect" },
                                        { id: "infouse", label: "How We Process Data" },
                                        { id: "legalbases", label: "Legal Grounds" },
                                        { id: "whoshare", label: "Data Sharing" },
                                        { id: "sociallogins", label: "Social Logins" },
                                        { id: "inforetain", label: "Data Retention" },
                                        { id: "privacyrights", label: "Your Rights" },
                                        { id: "contact", label: "Contact Us" }
                                    ].map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="group flex items-center justify-between py-2 text-soft-gray hover:text-primary transition-all duration-200"
                                        >
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" />
                                        </a>
                                    ))}
                                </nav>
                                <hr className="my-6 border-gray-100" />
                                <button
                                    onClick={() => window.print()}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-100 text-soft-gray font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    <Printer size={18} />
                                    Print Document
                                </button>
                            </div>
                        </aside>

                        {/* Content Area */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-3xl shadow-premium border border-gray-50 p-8 md:p-12 lg:p-16"
                            >
                                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-poppins prose-headings:font-bold prose-headings:text-soft-black prose-p:text-soft-gray prose-p:leading-relaxed prose-li:text-soft-gray">
                                    <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 mb-12">
                                        <h2 className="text-xl text-primary mt-0 mb-4 flex items-center gap-2 font-bold">
                                            <Mail size={20} />
                                            Questions or Concerns?
                                        </h2>
                                        <p className="m-0 text-soft-gray font-medium leading-relaxed">
                                            Reading this Privacy Notice will help you understand your privacy rights and choices.
                                            If you do not agree with our policies and practices, please do not use our Services.
                                            Still have questions? Reach out to us at <a href="mailto:kendall.core01@gmail.com" className="text-primary font-bold decoration-2 underline-offset-4 hover:underline">kendall.core01@gmail.com</a>.
                                        </p>
                                    </div>

                                    <section id="infocollect" className="scroll-mt-32">
                                        <h2>1. What Information Do We Collect?</h2>
                                        <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>

                                        <div className="bg-gray-50 rounded-2xl p-8 mt-6">
                                            <h4 className="mt-0">Personal Information Provided by You</h4>
                                            <p className="text-base mb-4">Depending on the context of your interactions, we may collect:</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                {[
                                                    "Full names", "Email addresses", "Mailing addresses",
                                                    "Billing addresses", "Payment card numbers", "Phone numbers"
                                                ].map((field) => (
                                                    <div key={field} className="flex items-center gap-2 text-soft-gray">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                        <span className="text-sm font-medium">{field}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    <section id="infouse" className="scroll-mt-32 mt-16 pt-16 border-t border-gray-100">
                                        <h2>2. How Do We Process Your Information?</h2>
                                        <p className="italic font-medium text-soft-black mb-6">In Short: We process data to provide, improve, and keep our Services secure.</p>
                                        <p>Specifically, we use your data to:</p>
                                        <ul className="space-y-4">
                                            <li><strong>Deliver requested services:</strong> Process orders, facilitate deliveries, and manage your account.</li>
                                            <li><strong>Provide support:</strong> Respond to inquiries and solve technical or billing issues.</li>
                                            <li><strong>Administrative communications:</strong> Notify you of updates to our terms, policies, or product features.</li>
                                            <li><strong>Safety and security:</strong> Prevent fraud, protect our infrastructure, and ensure compliance with law.</li>
                                        </ul>
                                    </section>

                                    <section id="inforetain" className="scroll-mt-32 mt-16 pt-16 border-t border-gray-100">
                                        <h2>6. How Long Do We Keep Your Information?</h2>
                                        <p>
                                            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice,
                                            unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
                                        </p>
                                        <p>
                                            When we have no ongoing legitimate business need to process your personal information, we will either delete or
                                            anonymize such information, or, if this is not possible (for example, backup archives), we will securely isolate it.
                                        </p>
                                    </section>

                                    <section id="contact" className="scroll-mt-32 mt-16 pt-16 border-t border-gray-100">
                                        <h2>13. How Can You Contact Us?</h2>
                                        <p>If you have questions or comments about this notice, you may contact our data protection team via email:</p>
                                        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center p-6 bg-off-white rounded-2xl border border-gray-100">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-soft-black m-0">Email Support</p>
                                                <a href="mailto:kendall.core01@gmail.com" className="text-primary font-medium hover:underline">kendall.core01@gmail.com</a>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
