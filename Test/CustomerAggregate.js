

const main  = async (workspaceId) => {
    let customers  = [] // ftech all customer


    await customers.map(async customer => {
        await aggrgate(customer.id, workspaceId)
    })

    console.log("successful")
}


main()
.then(console.log)
.catch(console.log)