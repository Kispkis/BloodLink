import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDate,
  parseGeoReference,
  parseDailyTimeBlocks,
  transformBloodReserves,
  transformInstitutions,
  transformSessions,
} from "../scripts/dadorScraperToFirebase.mjs";

test("normalizeDate converte DD-MM-YYYY para YYYY-MM-DD", () => {
  assert.equal(normalizeDate("26-02-2026"), "2026-02-26");
  assert.equal(normalizeDate("2026-02-26"), "2026-02-26");
  assert.equal(normalizeDate(""), "");
});

test("parseGeoReference interpreta coordenadas válidas", () => {
  assert.deepEqual(parseGeoReference("38.7223, -9.1393"), { lat: 38.7223, lng: -9.1393 });
  assert.equal(parseGeoReference("abc,def"), null);
  assert.equal(parseGeoReference(null), null);
});

test("parseDailyTimeBlocks extrai pares de horários", () => {
  assert.deepEqual(parseDailyTimeBlocks("09:00-13:00 / 14:00-17:00"), [
    { start: "09:00", end: "13:00" },
    { start: "14:00", end: "17:00" },
  ]);
  assert.deepEqual(parseDailyTimeBlocks("08:00"), []);
});

test("transformBloodReserves normaliza dados de reservas", () => {
  const payload = {
    data: {
      version: "26/02/2026 10:00",
      ReservasSangue: {
        Data: [["26/02/2026"]],
        IPST: [{ ABO: " a+ ", Cor: "verde" }],
        NACIONAL: [{ ABO: "o-", Cor: "amarelo" }],
        Regiao: [["NORTE"], { ABO: "ab+", Cor: "vermelho" }],
      },
    },
  };

  assert.deepEqual(transformBloodReserves(payload), {
    data_referencia: "26/02/2026",
    versao: "26/02/2026 10:00",
    ipst: [{ grupo: "A+", nivel: "VERDE" }],
    nacional: [{ grupo: "O-", nivel: "AMARELO" }],
    regioes: {
      NORTE: [{ grupo: "AB+", nivel: "VERMELHO" }],
    },
  });
});

test("transformInstitutions mapeia postos com geo", () => {
  const payload = {
    data: {
      CentrosColheita: [
        {
          Id: 1,
          SiglaInstituicao: "IPST",
          DesInstituicao: "Centro Lisboa",
          DesDistrito: "Lisboa",
          DesConcelho: "Lisboa",
          Morada: "Rua X",
          Horario: "09:00-13:00",
          Telefone: "210000000",
          Email: "x@x.pt",
          CodNuts2: "PT17",
          GeoReferencia: "38.7,-9.1",
        },
      ],
    },
  };

  assert.deepEqual(transformInstitutions(payload), [
    {
      id: 1,
      sigla: "IPST",
      instituicao: "Centro Lisboa",
      distrito: "Lisboa",
      concelho: "Lisboa",
      morada: "Rua X",
      horario_texto: "09:00-13:00",
      telefone: "210000000",
      email: "x@x.pt",
      nuts2: "PT17",
      geo: { lat: 38.7, lng: -9.1 },
    },
  ]);
});

test("transformSessions separa postos e brigadas móveis", () => {
  const payload = {
    data: {
      Sessoes: [
        {
          Id: 10,
          DesTipoSessao: "Posto Fixo",
          CodTipoSessao: 1,
          DataBrigada: "26-02-2026",
          HoraBrigada: "09:00-12:00",
          Local: "Hospital A",
          DesBrigada: "",
          DesInstituicao: "Inst A",
          DesDistrito: "Porto",
          DesConcelho: "Porto",
          GeoReferencia: "41.15,-8.61",
        },
        {
          Id: 11,
          DesTipoSessao: "Brigada",
          CodTipoSessao: 2,
          DataBrigada: "27-02-2026",
          HoraBrigada: "14:00-18:00",
          Local: "Praça B",
          DesBrigada: "Brigada Norte",
          DesInstituicao: "Inst B",
          DesDistrito: "Braga",
          DesConcelho: "Braga",
          GeoReferencia: "41.55,-8.42",
        },
      ],
    },
  };

  const result = transformSessions(payload);

  assert.equal(result.postos.length, 1);
  assert.equal(result.brigadasMoveis.length, 1);
  assert.equal(result.postos[0].data, "2026-02-26");
  assert.deepEqual(result.brigadasMoveis[0].horarios, [{ start: "14:00", end: "18:00" }]);
});
