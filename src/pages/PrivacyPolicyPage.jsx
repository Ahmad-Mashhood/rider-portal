import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import logo from '../assets/logo_transparent.png'

export default function PrivacyPolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16">
      {/* Top App Bar */}
      <header className="bg-[#FFF8F0] sticky top-0 z-40 border-b border-[#e1bfb5]/20 backdrop-blur-md">
        <div className="flex justify-between items-center px-4 md:px-16 w-full max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#fff1ed] transition-colors rounded-full text-[#594139] active:scale-95 cursor-pointer"
            >
              <Icon name="arrow_back" />
            </button>
            <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center border border-[#e1bfb5]/20">
              <img src={logo} alt="Food Genie" className="w-full h-full object-contain" />
            </div>
            <span className="text-[20px] font-bold text-[#ab3500] hidden sm:inline">Food Genie</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-semibold text-[#594139]">Privacy Policy</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ffdbd0] bg-[#fde3db] flex items-center justify-center">
              <Icon name="security" filled className="text-[#ab3500]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white p-6 md:p-10 rounded-3xl modern-tactile-card border border-[#f7ddd5] space-y-8">
          
          {/* Document Header */}
          <div className="border-b border-[#f7ddd5] pb-6">
            <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#261814] leading-tight">Privacy Policy</h1>
            <p className="text-[14px] text-[#594139] mt-2">Last Updated: July 8, 2026</p>
          </div>

          {/* Intro */}
          <div className="text-[16px] text-[#594139] leading-relaxed space-y-4">
            <p>
              Food Genie (<strong>"we," "our," "us"</strong>) operates an AI-powered food delivery platform connecting customers, restaurants, riders, and administrators. This Privacy Policy explains how we collect, use, store, and protect your information when you use our app and services.
            </p>
            <p>
              By using Food Genie, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">1</span>
              Information We Collect
            </h2>
            <div className="pl-8 space-y-4 text-[15px] text-[#594139] leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#261814] mb-1">1.1 Information You Provide</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Information:</strong> Name, email address, phone number, password (encrypted), profile picture.</li>
                  <li><strong>Delivery Information:</strong> Home/work addresses, delivery instructions.</li>
                  <li><strong>Payment Information:</strong> Billing details (processed via third-party payment gateways; we do not store full card details).</li>
                  <li><strong>Health & Nutrition Data (Optional):</strong> Dietary preferences, allergies, health goals, calorie/nutrition targets — used to power our AI recommendation and Health & Nutrition Intelligence features.</li>
                  <li><strong>Restaurant Partner Information:</strong> Business name, menu details, licenses, bank details (for the Restaurant Portal).</li>
                  <li><strong>Rider Information:</strong> Vehicle details, ID verification, bank details (for the Rider Portal).</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#261814] mb-1">1.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Location Data:</strong> Real-time GPS location (via Google Maps API) to show nearby restaurants, calculate delivery routes, and enable live order tracking.</li>
                  <li><strong>Device Information:</strong> Device type, operating system, IP address, browser type.</li>
                  <li><strong>Usage Data:</strong> Order history, search queries, app interactions, session duration.</li>
                  <li><strong>Communication Data:</strong> Messages exchanged between customers, riders, and restaurants (via Socket.io real-time chat).</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#261814] mb-1">1.3 Information from Third Parties</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Authentication data if you sign in via Firebase Authentication (Google, Facebook, etc.).</li>
                  <li>Data shared by payment processors for transaction verification.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">2</span>
              How We Use Your Information
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p className="mb-2">We use the collected information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Create and manage your account across our four portals (Customer, Restaurant, Rider, Admin).</li>
                <li>Process and deliver your orders, including real-time order tracking.</li>
                <li>Generate AI-powered food and nutrition recommendations using OpenAI's technology based on your preferences, order history, and health data.</li>
                <li>Calculate delivery routes and estimated delivery times via Google Maps.</li>
                <li>Enable real-time communication between customers, riders, and restaurants.</li>
                <li>Process payments and prevent fraudulent transactions.</li>
                <li>Send order updates, promotional offers, and service notifications.</li>
                <li>Improve our AI recommendation engine and overall app experience.</li>
                <li>Comply with legal obligations and resolve disputes.</li>
              </ul>
            </div>
          </section>

          {/* 3. AI and Automated Decision-Making */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">3</span>
              AI and Automated Decision-Making
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed space-y-2">
              <p>
                Food Genie uses artificial intelligence (powered by OpenAI) to generate personalized food and nutrition recommendations. This may involve processing your order history, stated preferences, and (if provided) health/dietary data.
              </p>
              <p>
                You may opt out of personalized AI recommendations at any time in your account settings; doing so will not affect your ability to place orders.
              </p>
            </div>
          </section>

          {/* 4. How We Share Your Information */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">4</span>
              How We Share Your Information
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed space-y-3">
              <p>We share information only as necessary to operate the platform:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>With Restaurants:</strong> Order details, delivery address, and special instructions.</li>
                <li><strong>With Riders:</strong> Pickup/delivery location and contact details necessary to complete delivery.</li>
                <li><strong>With Service Providers:</strong> Firebase (authentication & data storage), Google Maps (location services), OpenAI (AI recommendations), payment processors.</li>
                <li><strong>For Legal Reasons:</strong> If required by law, court order, or to protect the rights and safety of our users.</li>
              </ul>
              <p className="font-semibold text-[#261814]">
                We do not sell your personal data to third parties for marketing purposes.
              </p>
            </div>
          </section>

          {/* 5. Data Storage and Security */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">5</span>
              Data Storage and Security
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                <li>Data is stored securely using Firebase and industry-standard encryption practices.</li>
                <li>Passwords are hashed and never stored in plain text.</li>
                <li>We implement reasonable technical and organizational measures to protect your data from unauthorized access, alteration, or disclosure.</li>
                <li>Despite our efforts, no method of transmission or storage is 100% secure.</li>
              </ul>
            </div>
          </section>

          {/* 6. Your Rights and Choices */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">6</span>
              Your Rights and Choices
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access, update, or correct your personal information via your account settings.</li>
                <li>Delete your account and associated data (subject to legal/record-keeping requirements).</li>
                <li>Opt out of promotional communications.</li>
                <li>Disable location sharing (note: this may limit core app functionality).</li>
                <li>Withdraw consent for AI-based personalization at any time.</li>
              </ul>
            </div>
          </section>

          {/* 7. Data Retention */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">7</span>
              Data Retention
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your data by contacting us.
              </p>
            </div>
          </section>

          {/* 8. Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">8</span>
              Children's Privacy
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                Food Genie is not intended for use by individuals under the age of 13 (or the applicable minimum age in your jurisdiction). We do not knowingly collect personal information from children.
              </p>
            </div>
          </section>

          {/* 9. Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">9</span>
              Third-Party Services
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                Our app integrates with third-party services (Google Maps, Firebase, OpenAI, payment gateways). These providers have their own privacy policies governing the use of your information, and we encourage you to review them.
              </p>
            </div>
          </section>

          {/* 10. Changes to This Policy */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">10</span>
              Changes to This Policy
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify users of significant changes via the app or email. Continued use of Food Genie after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* 11. Contact Us */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#261814] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#ffe9e3] text-[#ab3500] flex items-center justify-center text-sm font-bold">11</span>
              Contact Us
            </h2>
            <div className="pl-8 text-[15px] text-[#594139] leading-relaxed">
              <p>
                If you have questions or concerns about this Privacy Policy or your data, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-[#fff1ed] rounded-xl border border-[#fde3db] inline-block">
                <p className="font-semibold text-[#261814]">Email Contact</p>
                <a href="mailto:ahmadmashhood.bcs018@gmail.com" className="text-[#ab3500] font-bold hover:underline">
                  ahmadmashhood.bcs018@gmail.com
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
