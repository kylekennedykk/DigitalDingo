export function AboutContent({ initialData }: AboutContentProps) {
  // ... state and content stay the same

  return (
    <main className="py-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-24 text-center">
        <h1 className="font-heading text-4xl md:text-6xl mb-6 text-black">
          About <span className="text-black">DigitalDingo</span>
        </h1>
      </section>

      {/* ... About Content section stays the same ... */}

      {/* Team Section */}
      <section className="container mx-auto px-4">
        <h2 className="font-heading text-3xl mb-12 text-center text-black">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {initialData.team.map(member => (
            <div 
              key={member.id}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <Image
                  src={member.photo || '/images/placeholder-profile.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="font-heading text-xl mb-1 text-black">{member.name}</h3>
              <p className="text-black">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Member Dialog */}
      <Dialog
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || ''}
      >
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={selectedMember?.photo || '/images/placeholder-profile.jpg'}
              alt={selectedMember?.name || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="font-heading text-xl text-black">{selectedMember?.role}</h3>
          <p className="text-black">{selectedMember?.description}</p>
        </div>
      </Dialog>
    </main>
  )
} 