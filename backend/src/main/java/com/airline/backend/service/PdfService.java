package com.airline.backend.service;

import com.airline.backend.entity.Booking;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Slf4j
@Service
public class PdfService {

    public byte[] generateTicketPdf(Booking booking) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // ── Title ────────────────────────────────────
            document.add(new Paragraph("✈ SkyBook — Boarding Pass")
                    .setBold()
                    .setFontSize(22)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.BLUE));

            document.add(new Paragraph(" "));

            // ── PNR & Status ─────────────────────────────
            document.add(new Paragraph(
                    "PNR: " + booking.getPnr() +
                            "          Status: " + booking.getBookingStatus())
                    .setBold()
                    .setFontSize(13)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(" "));

            // ── Flight Info Table ─────────────────────────
            Table flightTable = new Table(
                    UnitValue.createPercentArray(new float[]{1, 1}))
                    .useAllAvailableWidth();

            flightTable.addCell(headerCell("Flight Info"));
            flightTable.addCell(headerCell("Journey Info"));
            flightTable.addCell(dataCell("Flight No : " + booking.getFlight().getFlightNumber()));
            flightTable.addCell(dataCell("From       : " + booking.getFlight().getSource()));
            flightTable.addCell(dataCell("Date       : " + booking.getFlight().getDepartureDate()));
            flightTable.addCell(dataCell("To         : " + booking.getFlight().getDestination()));
            flightTable.addCell(dataCell("Departure  : " + booking.getFlight().getDepartureTime()));
            flightTable.addCell(dataCell("Arrival    : " + booking.getFlight().getArrivalTime()));

            document.add(flightTable);
            document.add(new Paragraph(" "));

            // ── Passenger Table ───────────────────────────
            Table passengerTable = new Table(
                    UnitValue.createPercentArray(new float[]{0.5f, 2, 1}))
                    .useAllAvailableWidth();

            passengerTable.addCell(headerCell("No"));
            passengerTable.addCell(headerCell("Passenger Name"));
            passengerTable.addCell(headerCell("Seat No"));

            passengerTable.addCell(dataCell("1"));
            passengerTable.addCell(dataCell(
                    booking.getUser().getName()));
            passengerTable.addCell(dataCell(
                    String.valueOf(booking.getFromSeatNo())));

            if (booking.getNoOfSeat() >= 2 && notEmpty(booking.getPassenger2())) {
                passengerTable.addCell(dataCell("2"));
                passengerTable.addCell(dataCell(booking.getPassenger2()));
                passengerTable.addCell(dataCell(
                        String.valueOf(booking.getFromSeatNo() + 1)));
            }
            if (booking.getNoOfSeat() >= 3 && notEmpty(booking.getPassenger3())) {
                passengerTable.addCell(dataCell("3"));
                passengerTable.addCell(dataCell(booking.getPassenger3()));
                passengerTable.addCell(dataCell(
                        String.valueOf(booking.getFromSeatNo() + 2)));
            }
            if (booking.getNoOfSeat() >= 4 && notEmpty(booking.getPassenger4())) {
                passengerTable.addCell(dataCell("4"));
                passengerTable.addCell(dataCell(booking.getPassenger4()));
                passengerTable.addCell(dataCell(
                        String.valueOf(booking.getFromSeatNo() + 3)));
            }

            document.add(passengerTable);
            document.add(new Paragraph(" "));

            // ── Price ─────────────────────────────────────
            document.add(new Paragraph(
                    "Seats: " + booking.getNoOfSeat() +
                            "     Price/Seat: ₹" + booking.getFlight().getPrice() +
                            "     Total: ₹" +
                            (booking.getFlight().getPrice() * booking.getNoOfSeat()))
                    .setBold()
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(" "));

            // ── Footer ────────────────────────────────────
            document.add(new Paragraph(
                    "Thank you for choosing SkyBook! Safe Travels! ✈️")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.GRAY));

            document.close();
            log.info("PDF generated for booking: {}", booking.getBookingId());

        } catch (Exception e) {
            log.error("PDF generation error: {}", e.getMessage());
        }
        return baos.toByteArray();
    }

    private Cell headerCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold())
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER);
    }

    private Cell dataCell(String text) {
        return new Cell()
                .add(new Paragraph(text))
                .setTextAlignment(TextAlignment.LEFT);
    }

    private boolean notEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }
}