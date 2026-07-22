import Image from 'next/image'

const team = {
  leader: {
    name: 'Ashish Gupta',
    role: 'Group Leader',
    image: '/image/team/ashish-gupta.jfif',
  },
  core: [
    {
      name: 'Coming Soon',
      role: 'Program Director',
      image: '/image/placeholder/user.jpg',
    },
    {
      name: 'Coming Soon',
      role: 'DevRel',
      image: '/image/placeholder/user.jpg',
    },
    {
      name: 'Coming Soon',
      role: 'Partnerships Lead',
      image: '/image/placeholder/user.jpg',
    },
    {
      name: 'Coming Soon',
      role: 'Growth Lead',
      image: '/image/placeholder/user.jpg',
    },
    {
      name: 'Coming Soon',
      role: 'Platform Lead',
      image: '/image/placeholder/user.jpg',
    },
  ],
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1D3A] to-[#132E59] px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">Meet the Team</h1>
          <p className="mt-3 text-slate-300">
            The students behind AWS Student Builder Group at Lovely Professional
            University.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-semibold text-white">
            Group Leader
          </h2>

          <div className="mx-auto max-w-sm rounded-xl border border-slate-700 bg-slate-900/40 p-6 text-center">
            <Image
              src={team.leader.image}
              alt={team.leader.name}
              width={120}
              height={120}
              className="mx-auto h-28 w-28 rounded-full object-cover"
            />

            <h3 className="mt-5 text-xl font-semibold text-white">
              {team.leader.name}
            </h3>

            <p className="mt-1 text-cyan-300">{team.leader.role}</p>
          </div>
        </section>

        {/* Core Team */}
        <section>
          <h2 className="mb-6 text-center text-2xl font-semibold text-white">
            Core Team
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.core.map((member) => (
              <div
                key={member.role}
                className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 text-center transition hover:border-cyan-400"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />

                <h3 className="mt-4 text-lg font-semibold text-white">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm text-cyan-300">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}