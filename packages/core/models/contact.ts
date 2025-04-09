import tscore from "@ts.app/core"
import mongoose, { Schema, Document, Types } from "mongoose"

export type ContactType = "Email" | "Phone" | "Address"

export interface ContactInput {
    external_id: string[]
    value: string
    type: ContactType
}

export interface ContactDocument extends ContactInput, Document {
    createdAt: Date;
    updatedAt: Date;
}

const contactSchema = new Schema<ContactDocument>({
    external_id: { type: [String], required: true, index: true },
    value: { type: String, required: true, index: true, unique: true },
    type: { type: String, required: true, index: true },
},{ timestamps:true })

export const ContactModel = tscore.db.mongoose.core.model<ContactDocument>('contacts', contactSchema)

export async function updateContact(contact_input: ContactInput): Promise<ContactDocument> {
    // find contact by user info value
    const contact = await ContactModel.findOne({ value: contact_input.value })

    if(!contact) { // create new contact
        const new_contact = new ContactModel(contact_input)
        await new_contact.save()
        return new_contact
    }

    // push exrental_id if not already present
    for (const external_id of contact_input.external_id) {
        if (!contact.external_id.includes(external_id)) {
            contact.external_id.push(external_id)
        }
    }

    await contact.save()
    return contact
}