import {Tickets,add} from '../tickets'

it('implements optimistic concurrency control',async ()=>{
    // Create an instance of a ticket

    const ticket=add({
        title:'concert',
        price:5,
        userId:'123'
    })

    // Save the ticket to the DB

    await ticket.save()

    // Fetch the ticket twice

    const fsInstance=await Tickets.findById(ticket.id)
    const scInstance=await Tickets.findById(ticket.id)

    // Make two separate changes to the tickets we fetched

    fsInstance!.set({pric:10})
    scInstance!.set({pric:15})

    // Save the first ticket

    await fsInstance!.save()

    // Save the second ticket

    try {
        await scInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('it should not reach to this point')
})

it('should increments version field after saving a record',async()=>{
    const ticket=add({
        title:'concert',
        price:5,
        userId:'123'
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)

})