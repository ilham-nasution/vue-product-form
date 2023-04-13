import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import FormField from "../FormInput.vue";

describe("FormField", () => {
  it("renders a label and input with the correct type", () => {
    const wrapper = mount(FormField, {
      props: {
        label: "Email",
        type: "email",
      },
    });

    expect(wrapper.find("label").text()).toBe("Email");
    expect(wrapper.find("input").attributes("type")).toBe("email");
  });

  it("renders a select element with the given brands", () => {
    const brands = [
      { id: 1, name: "Brand A" },
      { id: 2, name: "Brand B" },
      { id: 3, name: "Brand C" },
    ];
    const wrapper = mount(FormField, {
      props: {
        label: "Brand",
        type: "select",
        brands: brands,
      },
    });

    expect(wrapper.find("select").findAll("option").length).toBe(brands.length);
    brands.forEach((brand, index) => {
      expect(wrapper.find(`option:nth-child(${index + 1})`).text()).toBe(
        brand.name
      );
    });
  });

  it("renders a textarea element", () => {
    const wrapper = mount(FormField, {
      props: {
        label: "Description",
        type: "textarea",
      },
    });

    expect(wrapper.find("label").text()).toBe("Description");
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("renders radio buttons with the given label", () => {
    const wrapper = mount(FormField, {
      props: {
        label: "Condition",
        type: "radio",
      },
    });

    expect(wrapper.findAll('input[type="radio"]').length).toBe(2);
    expect(wrapper.find('input[type="radio"][name="condition"]').exists()).toBe(
      true
    );
  });

  it("renders a checkbox with the given label", () => {
    const wrapper = mount(FormField, {
      props: {
        label: "I agree to the terms and conditions",
        type: "checkbox",
      },
    });

    expect(wrapper.find("label").text()).toBe(
      "I agree to the terms and conditions"
    );
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
  });
});
