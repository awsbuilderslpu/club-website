import {
  GraduationCap,
  Laptop,
  Users,
  UserCog,
  Trophy,
  Award,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Structured Learning",
    description:
      "Guided AWS learning paths from Cloud Practitioner to Solutions Architect.",
  },
  {
    icon: Laptop,
    title: "Hands-on Labs",
    description:
      "Build projects using AWS services with practical workshops and labs.",
  },
  {
    icon: Users,
    title: "Industry Network",
    description:
      "Connect with mentors, speakers, and professionals from the cloud community.",
  },
  {
    icon: UserCog,
    title: "Expert Mentorship",
    description:
      "Learn from AWS-certified students and industry professionals.",
  },
  {
    icon: Trophy,
    title: "Hackathons & Events",
    description:
      "Participate in workshops, hackathons, and technical community events.",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Earn community and AWS certificates by completing learning tracks.",
  },
];

export default function WhatWeOffer() {
  return (
    <section id="about"
    className="py-24 bg-gradient-to-b from-[#05060f] to-[#132E59]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-white">
            What we offer
          </h2>

          <p className="mt-4 text-slate-400">
            Everything you need to start your cloud journey—from learning AWS to
            building projects and connecting with the community.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <Icon className="h-8 w-8 text-cyan-400" />

              <h3 className="mt-5 text-lg font-semibold text-white">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}