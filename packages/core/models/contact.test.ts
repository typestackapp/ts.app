import { describe, it, expect } from "vitest"
import { ContactModel, ContactInput, updateContact } from "@ts.app/core/models/contact.js"
describe('Test contacts', () => {
    
    const contacts_input: ContactInput[] = [
        {
            external_id: ["user-1"],
            value: "test@1.com",
            type: "Email"
        },
        {
            external_id: ["user-1"],
            value: "123456789",
            type: "Phone"
        },
        {
            external_id: ["user-1"],
            value: "test@2.com",
            type: "Email"
        },
        {
            external_id: ["user-2"],
            value: "test@1.com",
            type: "Email"
        },
        {
            external_id: ["user-2"],
            value: "123456789",
            type: "Phone"
        },
    ]

    const expected: ContactInput[] = [
        {
            external_id: ["user-1", "user-2"],
            value: "test@1.com",
            type: "Email"
        },
        {
            external_id: ["user-1", "user-2"],
            value: "123456789",
            type: "Phone"
        },
        {
            external_id: ["user-1"],
            value: "test@2.com",
            type: "Email"
        }
    ]

    it('schould create new and update existing contacts and external ids', async () => {
        for await(const contact_input of contacts_input) {
            await updateContact(contact_input)
        }
    })

    it('chould compare to expected contact list', async () => {
        for await(const contact_expect of expected) {
            const contact = await ContactModel.findOne({ value: contact_expect.value })
            if(!contact) throw "Contact not found"
            expect(contact.external_id).to.have.members(contact_expect.external_id)
        }
    })
})