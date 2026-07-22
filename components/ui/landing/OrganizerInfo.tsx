export default function OrganizerInfo() {
  const stats = [
    { value: "5K+", label: "Active Members" },
    { value: "10+", label: "Annual Events" },
    { value: "100+", label: "AWS Certified Students" },
    { value: "50h+", label: "Training Every Year" },
  ];

  const partners = [
    { name: "AWS", logo: "/image/logo/aws.png" },
    { name: "Niwi.ai", logo: "/image/logo/niwi.png" },
    { name: ".XYZ Registry", logo: "/image/logo/xyz.png" },
    { name: "LPU", logo: "/image/logo/lpu.png" },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <img
              src="/image/logo/aws_student_builder_group.png"
              alt="AWS Student Builder Group"
              className="mb-8 h-16"
            />

            <h2 className="text-4xl font-bold text-white">
              AWS Student Builder Group LPU
            </h2>

            <p className="mt-6 leading-8 text-slate-300">
              We are a student-led cloud community at Lovely Professional
              University helping students learn AWS, build real-world projects,
              prepare for certifications, and connect with the cloud industry
              through workshops, hackathons, and mentorship.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-700 bg-slate-900/40 p-6"
              >
                <div className="text-3xl font-bold text-cyan-400">
                  {stat.value}
                </div>

                <div className="mt-2 text-sm text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-slate-700 pt-12">
          <p className="mb-8 text-center text-sm font-medium tracking-wide text-slate-400">
            Trusted by
          </p>

          <div className="flex flex-wrap items-center justify-center gap-12">
            {partners.map((partner) => (
              <img
                key={partner.name}
                src={partner.logo}
                alt={partner.name}
                className="h-8 opacity-80 transition hover:opacity-100"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}